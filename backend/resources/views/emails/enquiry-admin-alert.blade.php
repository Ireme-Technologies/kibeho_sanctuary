<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #222; line-height: 1.5;">
  <p>A new enquiry was submitted.</p>
  <ul>
    <li><strong>Name:</strong> {{ $enquiry->name }}</li>
    <li><strong>Email:</strong> {{ $enquiry->email ?: '—' }}</li>
    <li><strong>Phone:</strong> {{ $enquiry->phone ?: '—' }}</li>
    <li><strong>Channel:</strong> {{ ucfirst($enquiry->channel) }}</li>
    <li><strong>Status:</strong> {{ $enquiry->status }}</li>
  </ul>
  <p style="white-space: pre-wrap; background: #f6f6f6; padding: 12px; border-radius: 6px;">{{ $enquiry->message }}</p>
</body>
</html>
