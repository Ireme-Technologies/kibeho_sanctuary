<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
  <p>Hello {{ $enquiry->name }},</p>
  <p>Thank you for contacting <strong>Kibeho Sanctuary</strong>. We have received your message and will get back to you soon.</p>
  <p><strong>Your message:</strong></p>
  <p style="white-space: pre-wrap; background: #f6f6f6; padding: 12px; border-radius: 6px;">{{ $enquiry->message }}</p>
  <p>May Our Lady of Kibeho keep you in her prayers.</p>
  <p>Best regards,<br>Kibeho Sanctuary</p>
</body>
</html>
