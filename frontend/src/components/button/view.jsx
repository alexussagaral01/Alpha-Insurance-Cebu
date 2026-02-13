import React from "react";
import { FiEye, FiUser, FiFileText, FiHash, FiCreditCard } from "react-icons/fi";

const ViewModal = ({ selectedUser, onClose, premiumModalBackdrop, premiumModal, premiumModalHeader, premiumModalTitle, premiumModalBody, premiumModalFooter, secondaryButton, infoBadge, fieldGroup, fieldLabel, fieldValue, divider }) => {
  if (!selectedUser) return null;

  // Helper function to format YYYY-MM-DD to MM/DD/YYYY
  const formatDateToDisplay = (dateString) => {
    if (!dateString) return "N/A";
    
    // Check if date is in YYYY-MM-DD format
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-');
      return `${month}/${day}/${year}`;
    }
    
    // If already formatted or different format, return as-is
    return dateString;
  };

  // Handle print
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Record Details - ${selectedUser.assuredName || selectedUser.name}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #333;
            background: white;
            padding: 0.5in;
          }
          .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #1e6b47;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .header h1 {
            font-size: 16px;
            color: #1e6b47;
            margin-bottom: 2px;
          }
          .header p {
            font-size: 9px;
            color: #666;
          }
          .section {
            margin-bottom: 10px;
          }
          .section-title {
            font-size: 10px;
            font-weight: bold;
            color: white;
            background-color: #1e6b47;
            padding: 4px 6px;
            margin-bottom: 6px;
          }
          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 8px;
          }
          .field {
            display: flex;
            flex-direction: column;
          }
          .field-label {
            font-size: 9px;
            font-weight: bold;
            color: #1e6b47;
            text-transform: uppercase;
            margin-bottom: 2px;
            letter-spacing: 0.3px;
          }
          .field-value {
            font-size: 10px;
            color: #333;
            padding: 3px 4px;
            border: 0.5px solid #ddd;
            background-color: #fafafa;
          }
          .divider {
            border-top: 1px solid #ddd;
            margin: 8px 0;
          }
          .three-column {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
          }
          .four-column {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 8px;
          }
          .grand-total-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 8px;
          }
          .grand-total {
            font-size: 11px;
            font-weight: bold;
            color: #15803d;
            padding: 5px;
            background-color: #f0fdf4;
            border: 1px solid #22c55e;
            text-align: right;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .page {
              width: 100%;
              height: auto;
              margin: 0;
              padding: 0.5in;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <h1>RECORD DETAILS</h1>
            <p>Motor Car Insurance Policy Document</p>
          </div>

          <!-- Assured Information -->
          <div class="section">
            <div class="section-title">ASSURED INFORMATION</div>
            <div class="content-grid">
              <div class="field">
                <div class="field-label">Assured Name</div>
                <div class="field-value">${selectedUser.assuredName || selectedUser.name || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Address</div>
                <div class="field-value">${selectedUser.address || "N/A"}</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Policy Information -->
          <div class="section">
            <div class="section-title">POLICY INFORMATION</div>
            <div class="four-column">
              <div class="field">
                <div class="field-label">Policy No.</div>
                <div class="field-value">${selectedUser.policyNumber || selectedUser.pn || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">COC No.</div>
                <div class="field-value">${selectedUser.cocNumber || selectedUser.coc || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">OR No.</div>
                <div class="field-value">${selectedUser.orNumber || selectedUser.or || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Type</div>
                <div class="field-value">${selectedUser.cType || "N/A"}</div>
              </div>
            </div>
            <div class="content-grid" style="margin-top: 4px;">
              <div class="field">
                <div class="field-label">Year</div>
                <div class="field-value">${selectedUser.year || "N/A"}</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Policy Dates -->
          <div class="section">
            <div class="section-title">POLICY DATES</div>
            <div class="four-column">
              <div class="field">
                <div class="field-label">From Date</div>
                <div class="field-value">${formatDateToDisplay(selectedUser.fromDate)}</div>
              </div>
              <div class="field">
                <div class="field-label">To Date</div>
                <div class="field-value">${formatDateToDisplay(selectedUser.toDate)}</div>
              </div>
              <div class="field">
                <div class="field-label">Issued</div>
                <div class="field-value">${formatDateToDisplay(selectedUser.issued)}</div>
              </div>
              <div class="field">
                <div class="field-label">Received</div>
                <div class="field-value">${formatDateToDisplay(selectedUser.received)}</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Vehicle Details -->
          <div class="section">
            <div class="section-title">VEHICLE DETAILS</div>
            <div class="four-column">
              <div class="field">
                <div class="field-label">Make</div>
                <div class="field-value">${selectedUser.make || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Model</div>
                <div class="field-value">${selectedUser.model || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Body Type</div>
                <div class="field-value">${selectedUser.bodyType || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Color</div>
                <div class="field-value">${selectedUser.color || "N/A"}</div>
              </div>
            </div>
            <div class="four-column" style="margin-top: 4px;">
              <div class="field">
                <div class="field-label">Plate No.</div>
                <div class="field-value">${selectedUser.plateNo || selectedUser.plate || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Chassis No.</div>
                <div class="field-value">${selectedUser.chassisNo || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">Motor No.</div>
                <div class="field-value">${selectedUser.motorNo || "N/A"}</div>
              </div>
              <div class="field">
                <div class="field-label">MV File No.</div>
                <div class="field-value">${selectedUser.mvFileNo || "N/A"}</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Premium & Charges -->
          <div class="section">
            <div class="section-title">PREMIUM & CHARGES</div>
            <div class="three-column">
              <div class="field">
                <div class="field-label">Premium</div>
                <div class="field-value">${selectedUser.premium || "₱0"}</div>
              </div>
              <div class="field">
                <div class="field-label">Other Charges</div>
                <div class="field-value">${selectedUser.otherCharges || "₱0"}</div>
              </div>
              <div class="field">
                <div class="field-label">Doc. Stamps</div>
                <div class="field-value">${selectedUser.docStamps || "₱0"}</div>
              </div>
            </div>
            <div class="three-column" style="margin-top: 4px;">
              <div class="field">
                <div class="field-label">E-VAT (12%)</div>
                <div class="field-value">${selectedUser.eVat || "₱0"}</div>
              </div>
              <div class="field">
                <div class="field-label">Local Govt Tax</div>
                <div class="field-value">${selectedUser.localGovtTax || "₱0"}</div>
              </div>
              <div class="field">
                <div class="field-label">Auth. Fee</div>
                <div class="field-value">${selectedUser.authFee || "₱0"}</div>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Total Amount -->
          <div class="section">
            <div class="section-title">TOTAL AMOUNT</div>
            <div class="grand-total-row">
              <div></div>
              <div class="grand-total">GRAND TOTAL: ${selectedUser.grandTotal || "₱0"}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create invisible iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    // Write content to iframe
    iframe.contentDocument.write(printContent);
    iframe.contentDocument.close();
    
    // Print after content loads
    iframe.onload = () => {
      iframe.contentWindow.print();
      // Remove iframe after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 100);
    };
    
    // Fallback for immediate print
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        iframe.contentWindow.print();
      }
    }, 500);
  };

  const twoColumnContainer = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "20px"
  };

  const compactFieldGroup = {
    marginBottom: "0"
  };

  return (
    <div style={premiumModalBackdrop}>
      <div style={premiumModal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={premiumModalHeader}>
          <div className="modal-header-decoration"></div>
          <h3 style={premiumModalTitle}>
            <FiEye size={30} />
            View Record Details
          </h3>
        </div>

        {/* Modal Body */}
        <div style={premiumModalBody}>
          {/* Assured Information Section */}
          <div style={infoBadge}>
            <FiUser size={14} />
            Assured Information
          </div>

          <div style={twoColumnContainer}>
            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiUser size={14} />
                Assured Name
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.assuredName || selectedUser.name || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Address
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.address || "N/A"}</div>
            </div>
          </div>

          <div style={divider}></div>

          {/* Policy Information Section */}
          <div style={infoBadge}>
            <FiFileText size={14} />
            Policy Information
          </div>

          <div style={twoColumnContainer}>
            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiHash size={14} />
                Policy Number
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.policyNumber || selectedUser.pn || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiFileText size={14} />
                COC Number
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.cocNumber || selectedUser.coc || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiFileText size={14} />
                OR Number
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.orNumber || selectedUser.or || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiFileText size={14} />
                Type
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.cType || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Year
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.year || "N/A"}</div>
            </div>
          </div>

          <div style={divider}></div>

          {/* Policy Dates Section */}
          <div style={infoBadge}>
            <FiCreditCard size={14} />
            Policy Dates
          </div>

          <div style={twoColumnContainer}>
            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 From Date
              </label>
              <div style={fieldValue} className="field-value-hover">{formatDateToDisplay(selectedUser.fromDate)}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 To Date
              </label>
              <div style={fieldValue} className="field-value-hover">{formatDateToDisplay(selectedUser.toDate)}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Issued Date
              </label>
              <div style={fieldValue} className="field-value-hover">{formatDateToDisplay(selectedUser.issued)}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Received Date
              </label>
              <div style={fieldValue} className="field-value-hover">{formatDateToDisplay(selectedUser.received)}</div>
            </div>
          </div>

          <div style={divider}></div>

          {/* Vehicle Details Section */}
          <div style={infoBadge}>
            <FiCreditCard size={14} />
            Vehicle Details
          </div>

          <div style={twoColumnContainer}>
            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Make
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.make || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Model
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.model || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Body Type
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.bodyType || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Color
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.color || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Plate Number
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.plateNo || selectedUser.plate || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Chassis Number
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.chassisNo || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Motor Number
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.motorNo || "N/A"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 MV File Number
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.mvFileNo || "N/A"}</div>
            </div>
          </div>

          <div style={divider}></div>

          {/* Premium & Charges Section */}
          <div style={infoBadge}>
            <FiCreditCard size={14} />
            Premium & Charges
          </div>

          <div style={twoColumnContainer}>
            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Premium
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.premium || "₱0"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Other Charges
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.otherCharges || "₱0"}</div>
            </div>
          </div>

          <div style={divider}></div>

          {/* Tax & Fee Section */}
          <div style={infoBadge}>
            <FiCreditCard size={14} />
            Taxes & Fees
          </div>

          <div style={twoColumnContainer}>
            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Doc. Stamps (12.5%)
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.docStamps || "₱0"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 E-VAT (12%)
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.eVat || "₱0"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Local Govt Tax (0.5%)
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.localGovtTax || "₱0"}</div>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Auth. Fee (Fixed)
              </label>
              <div style={fieldValue} className="field-value-hover">{selectedUser.authFee || "₱0"}</div>
            </div>
          </div>

          <div style={divider}></div>

          {/* Total Section */}
          <div style={infoBadge}>
            <FiCreditCard size={14} />
            Total Amount
          </div>

          <div style={{marginBottom: "0"}}>
            <label style={fieldLabel}>
               Grand Total
            </label>
            <div style={{...fieldValue, backgroundColor: "#f0fdf4", borderColor: "#22c55e", fontWeight: "700", fontSize: "18px", color: "#15803d"}} className="field-value-hover">{selectedUser.grandTotal || "₱0"}</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={premiumModalFooter}>
          <button 
            style={{...secondaryButton}}
            className="premium-button secondary-button"
            onClick={handlePrint}
            title="Print this record"
          >
            🖨️ Print
          </button>
          <button 
            style={secondaryButton}
            className="premium-button secondary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
