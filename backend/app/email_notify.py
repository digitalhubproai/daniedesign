"""Outbound email notifications (inquiries + visitor thank-you).

Transport: plain SMTP over STARTTLS, configured entirely by the SMTP_* settings.
Any provider works — point SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD at
it in the environment. If they are unset, sending is skipped and logged.

Every call is best-effort: failures are logged and swallowed so a broken email
transport can never fail the public form submission (the row is already in the
DB and visible in the admin CRM). Uses only the stdlib so no new dependencies
are needed on Vercel.
"""

import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

logger = logging.getLogger(__name__)


def _send_via_smtp(to_email, to_name, subject, body, reply_to=None):
    """Send through the configured SMTP relay."""
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
    logger.info("SMTP accepted mail to %s", to_email)


def send_email(to_email, to_name, subject, body, reply_to=None):
    """Best-effort send over SMTP; a no-op (logged) when it isn't configured."""
    if not settings.SMTP_HOST or not settings.SMTP_PASSWORD:
        logger.info("SMTP not configured; skipping mail to %s", to_email)
        return

    try:
        _send_via_smtp(to_email, to_name, subject, body, reply_to)
    except Exception:
        logger.exception("Mail to %s failed", to_email)


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