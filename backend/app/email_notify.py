"""Outbound email notifications via Brevo (inquiries + visitor thank-you).

Primary transport: Brevo REST API (POST /v3/smtp/email) using the account's
API key — works from any environment, including Vercel serverless, with no
IP allowlisting. Fallback transport: Brevo SMTP relay (STARTTLS :587), which
requires the sender IP to be allowlisted in the Brevo dashboard.

Every call is best-effort: failures are logged and swallowed so a broken
email transport can never fail the public form submission (the row is
already in the DB and visible in the admin CRM). Uses only the stdlib so no
new dependencies are needed on Vercel.
"""

import json
import logging
import smtplib
import urllib.error
import urllib.request
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _send_via_api(to_email, to_name, subject, body, reply_to=None):
    """Send through the Brevo REST API."""
    payload = {
        "sender": {"name": settings.SMTP_FROM_NAME, "email": settings.SMTP_FROM_EMAIL},
        "to": [{"email": to_email, "name": to_name or to_email}],
        "subject": subject,
        "textContent": body,
    }
    if reply_to:
        payload["replyTo"] = {"email": reply_to}
    req = urllib.request.Request(
        BREVO_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "api-key": settings.BREVO_API_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        logger.info("Brevo API accepted mail to %s (HTTP %s)", to_email, resp.status)


def _send_via_smtp(to_email, to_name, subject, body, reply_to=None):
    """Send through the Brevo SMTP relay (needs an allowlisted IP)."""
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    msg["To"] = f"{to_name} <{to_email}>" if to_name else to_email
    if reply_to:
        msg["Reply-To"] = reply_to
    msg.set_content(body)
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
    logger.info("Brevo SMTP accepted mail to %s", to_email)


def send_email(to_email, to_name, subject, body, reply_to=None):
    """Best-effort send: Brevo API first, SMTP relay as fallback."""
    transports = []
    if settings.BREVO_API_KEY:
        transports.append(("Brevo API", _send_via_api))
    if settings.SMTP_PASSWORD:
        transports.append(("Brevo SMTP", _send_via_smtp))
    if not transports:
        logger.info("No email transport configured; skipping mail to %s", to_email)
        return

    for label, sender in transports:
        try:
            sender(to_email, to_name, subject, body, reply_to)
            return
        except urllib.error.HTTPError as exc:
            logger.error("Mail via %s failed (HTTP %s): %s",
                         label, exc.code, exc.read().decode("utf-8", "replace"))
        except Exception:
            logger.exception("Mail via %s failed", label)


def send_inquiry_notification(name, email, company, service, message, inquiry_id):
    """Email the studio inbox about a new contact-form submission."""
    if not settings.NOTIFY_EMAIL:
        logger.info("NOTIFY_EMAIL not set; skipping inquiry notification")
        return
    body = (
        f"You have a new website inquiry (#{inquiry_id}).\n\n"
        f"Name:    {name}\n"
        f"Email:   {email}\n"
        f"Company: {company or '-'}\n"
        f"Service: {service}\n\n"
        f"Message:\n{message}\n\n"
        f"Review it in the admin panel: /admin/inquiries"
    )
    send_email(
        settings.NOTIFY_EMAIL, "Danie Design",
        f"New inquiry from {name} ({service}) — Danie Design",
        body,
        reply_to=email,  # "Reply" in Gmail goes straight to the visitor
    )


def send_thanks_email(name, email, service):
    """Auto-reply thanking the visitor for their inquiry."""
    first_name = name.strip().split()[0] if name.strip() else "there"
    body = (
        f"Hi {first_name},\n\n"
        f"Thanks for reaching out to Danie Design! We've received your inquiry"
        f"{' about ' + service if service else ''} and our team will get back to "
        "you within one business day.\n\n"
        "If you'd like to share anything else in the meantime, just reply to "
        "this email.\n\n"
        "Talk soon,\n"
        "The Danie Design Team\n"
        f"{settings.NOTIFY_EMAIL}"
    )
    send_email(email, name, "We've got your message — Danie Design", body)
