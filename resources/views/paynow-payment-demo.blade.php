<!DOCTYPE html>
<html>
<head>
    <title>Paynow Payment Demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #007cba;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
        }
        button:hover {
            background-color: #005a87;
        }
        .payment-button {
            display: none;
            text-align: center;
            margin-top: 20px;
        }
        .status {
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .status.pending {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        .status.paid {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>
<body>
    <h1>Paynow Payment Demo</h1>
    
    <div id="payment-form">
        <div class="form-group">
            <label for="amount">Amount (ZWL):</label>
            <input type="number" id="amount" step="0.01" min="0.01" value="3.99">
        </div>
        
        <div class="form-group">
            <label for="description">Payment Description:</label>
            <input type="text" id="description" value="Service Payment">
        </div>
        
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" value="ddstarbelieveit@gmail.com">
        </div>
        
        <button id="create-payment">Create Payment</button>
    </div>
    
    <div id="payment-button" class="payment-button">
        <h2>Complete Your Payment</h2>
        <p>Click the button below to proceed with your payment:</p>
        <a id="paynow-link" target="_blank">
            <img src="https://www.paynow.co.zw/Content/Buttons/Medium_buttons/button_pay-now_medium.png" style="border:0" />
        </a>
        <p><small>After completing your payment, please click the button below to check the status.</small></p>
        <button id="check-status">Check Payment Status</button>
    </div>
    
    <div id="payment-status" class="status" style="display: none;"></div>
        <script>
        document.getElementById('create-payment').addEventListener('click', function() {
            const amount = document.getElementById('amount').value;
            const description = document.getElementById('description').value;
            const email = document.getElementById('email').value;
            
            if (!amount || !description || !email) {
                alert('Please fill in all fields');
                return;
            }
            
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]') ? 
                document.querySelector('meta[name="csrf-token"]').getAttribute('content') : 
                '';
            
            // Create payment
            fetch('/api/paynow/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    amount: amount,
                    description: description,
                    email: email
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.error || 'Network response was not ok');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // Show the Paynow button
                    document.getElementById('payment-form').style.display = 'none';
                    document.getElementById('paynow-link').href = data.payment_link;
                    document.getElementById('payment-button').style.display = 'block';
                    
                    // Store the reference for later use
                    localStorage.setItem('paymentReference', data.reference);
                } else {
                    alert('Error creating payment: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error creating payment: ' + error.message);
            });
        });
        
        document.getElementById('check-status').addEventListener('click', function() {
            const reference = localStorage.getItem('paymentReference');
            
            if (!reference) {
                alert('No payment reference found');
                return;
            }
            
            // In a real implementation, you would check with Paynow's API
            // For this demo, we'll simulate verifying the payment
            fetch(`/api/paynow/verify-payment?reference=${reference}`)
            .then(response => response.json())
            .then(data => {
                const statusDiv = document.getElementById('payment-status');
                statusDiv.style.display = 'block';
                
                if (data.status === 'paid') {
                    statusDiv.className = 'status paid';
                    statusDiv.innerHTML = `<strong>Payment Successful!</strong><br>Reference: ${data.reference}<br>Amount: $${data.amount}<br>Description: ${data.description}`;
                } else {
                    statusDiv.className = 'status pending';
                    statusDiv.innerHTML = `<strong>Payment Pending</strong><br>Reference: ${data.reference}<br>Amount: $${data.amount}<br>Description: ${data.description}<br><br>Please complete your payment and check again.`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                const statusDiv = document.getElementById('payment-status');
                statusDiv.style.display = 'block';
                statusDiv.className = 'status error';
                statusDiv.innerHTML = 'Error checking payment status';
            });
        });
    </script>
</body>
</html>
