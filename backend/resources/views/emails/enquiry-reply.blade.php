<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
  <p>Hello {{ $enquiry->name }},</p>
  <p>You have a new reply regarding your enquiry with Kibeho Sanctuary:</p>
  <p style="white-space: pre-wrap; background: #f6f6f6; padding: 12px; border-radius: 6px;">{{ $reply }}</p>
  <p>Best regards,<br>Kibeho Sanctuary</p>
</body>
</html>
