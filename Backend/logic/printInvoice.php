<?php

include_once("../config/dataHandler_Orders.php");

class printInvoice
{
    public function generateInvoice($orderId)
    {
        $dh = new DataHandler_Orders();
        try {
            $order = $dh->fetchOrderDetails($orderId);
            if ($order) {
                $invoiceNumber = $this->generateInvoiceNumber($orderId);
                ob_start(); // Start output buffering
                ?>
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Invoice <?php echo $invoiceNumber; ?></title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
                        .invoice-box table { width: 100%; line-height: inherit; text-align: left; }
                        .invoice-box table td { padding: 5px; vertical-align: top; }
                        .invoice-box table tr td:nth-child(2) { text-align: right; }
                        .invoice-box table tr.top table td { padding-bottom: 20px; }
                        .invoice-box table tr.top table td.title { font-size: 45px; line-height: 45px; color: #333; }
                        .invoice-box table tr.information table td { padding-bottom: 40px; }
                        .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
                        .invoice-box table tr.details td { padding-bottom: 20px; }
                        .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
                        .invoice-box table tr.item.last td { border-bottom: none; }
                        .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="invoice-box">
                        <table>
                            <tr class="top">
                                <td colspan="2">
                                    <table>
                                        <tr>
                                            <td class="title">
                                                <h2>Invoice</h2>
                                            </td>
                                            <td>
                                                Invoice #: <?php echo $invoiceNumber; ?><br>
                                                Created: <?php echo date("F j, Y", strtotime($order['order_date'])); ?><br>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr class="information">
                                <td colspan="2">
                                    <table>
                                        <tr>
                                            <td>
                                                <?php echo $order['firstname'] . ' ' . $order['lastname']; ?><br>
                                                <?php echo $order['street']; ?><br>
                                                <?php echo $order['city'] . ', ' . $order['zip']; ?>
                                            </td>
                                            <td>
                                                ShirtShack<br>
                                                support@shirtshack.com
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr class="heading">
                                <td>Item</td>
                                <td>Price</td>
                            </tr>
                            
                            <?php foreach ($order['items'] as $item) { ?>
                                <tr class="item">
                                    <td><?php echo $item['product_name']; ?></td>
                                    <td><?php echo '$' . $item['price'] . ' x ' . $item['quantity']; ?></td>
                                </tr>
                            <?php } ?>
                            
                            <tr class="total">
                                <td></td>
                                <td>Total: $<?php echo $order['total_price']; ?></td>
                            </tr>
                        </table>
                    </div>
                </body>
                </html>
                <?php
                $html = ob_get_clean(); // Get the buffered output and clean the buffer
                return $html;
            } else {
                return "Order not found.";
            }
        } catch (Exception $e) {
            return "Error: " . $e->getMessage();
        }
    }

    private function generateInvoiceNumber($orderId)
    {
        return "INV-" . $orderId . "-" . time();
    }
}
?>
