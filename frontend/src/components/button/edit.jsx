import React from "react";
import { FiEdit2, FiFileText, FiHash, FiCreditCard } from "react-icons/fi";

const EditModal = ({ editData, onEditChange, onSave, onCancel, premiumModalBackdrop, premiumModal, premiumModalHeader, premiumModalTitle, premiumModalBody, premiumModalFooter, primaryButton, secondaryButton, infoBadge, fieldGroup, fieldLabel, premiumInput, divider }) => {
  if (!editData) return null;

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
            <FiEdit2 size={30} />
            Edit Record
          </h3>
        </div>

        {/* Modal Body */}
        <div style={premiumModalBody}>
          {/* Assured Information Section */}
          <div style={infoBadge}>
            <FiEdit2 size={14} />
            Assured Information
          </div>

          <div style={twoColumnContainer}>
            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiEdit2 size={14} />
                Assured Name
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.assuredName || ""} 
                onChange={(e) => onEditChange("assuredName", e.target.value.toUpperCase())} 
                placeholder="Enter assured name"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Address
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.address || ""} 
                onChange={(e) => onEditChange("address", e.target.value.toUpperCase())} 
                placeholder="Enter address"
              />
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
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.policyNumber || ""} 
                onChange={(e) => onEditChange("policyNumber", e.target.value.toUpperCase())} 
                placeholder="POL-XXXX"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiFileText size={14} />
                COC Number
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.cocNumber || ""} 
                onChange={(e) => onEditChange("cocNumber", e.target.value.toUpperCase())} 
                placeholder="COC-XXXX"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiFileText size={14} />
                OR Number
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.orNumber || ""} 
                onChange={(e) => onEditChange("orNumber", e.target.value.toUpperCase())} 
                placeholder="OR-XXXX"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                <FiFileText size={14} />
                Type
              </label>
              <select
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.cType || ""}
                onChange={(e) => onEditChange("cType", e.target.value.toUpperCase())}
              >
                <option value="">Select Type</option>
                <option value="MC-CTPL-CEB">MC-CTPL-CEB</option>
                <option value="PC-CTPL-CEB">PC-CTPL-CEB</option>
                <option value="CV-CTPL-CEB">CV-CTPL-CEB</option>
                <option value="LTO-CTPL-CEB">LTO-CTPL-CEB</option>
              </select>
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                Year
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.year || ""} 
                onChange={(e) => onEditChange("year", e.target.value.toUpperCase())} 
                placeholder="e.g., 2025"
              />
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
              <input 
                style={{...premiumInput, cursor: "pointer"}}
                className="premium-input"
                type="date"
                value={editData.fromDate || ""} 
                onChange={(e) => onEditChange("fromDate", e.target.value)}
                onClick={(e) => {
                  if (e.target.showPicker) {
                    e.target.showPicker();
                  }
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1e6b47";
                }}
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 To Date
              </label>
              <input 
                style={{...premiumInput, cursor: "pointer"}}
                className="premium-input"
                type="date"
                value={editData.toDate || ""} 
                onChange={(e) => onEditChange("toDate", e.target.value)}
                onClick={(e) => {
                  if (e.target.showPicker) {
                    e.target.showPicker();
                  }
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1e6b47";
                }}
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Issued Date
              </label>
              <input 
                style={{...premiumInput, cursor: "pointer"}}
                className="premium-input"
                type="date"
                value={editData.issued || ""} 
                onChange={(e) => onEditChange("issued", e.target.value)}
                onClick={(e) => {
                  if (e.target.showPicker) {
                    e.target.showPicker();
                  }
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1e6b47";
                }}
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Received Date
              </label>
              <input 
                style={{...premiumInput, cursor: "pointer"}}
                className="premium-input"
                type="date"
                value={editData.received || ""} 
                onChange={(e) => onEditChange("received", e.target.value)}
                onClick={(e) => {
                  if (e.target.showPicker) {
                    e.target.showPicker();
                  }
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1e6b47";
                }}
              />
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
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.make || ""} 
                onChange={(e) => onEditChange("make", e.target.value.toUpperCase())} 
                placeholder="TOYOTA"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Model
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.model || ""} 
                onChange={(e) => onEditChange("model", e.target.value.toUpperCase())} 
                placeholder="CAMRY"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Body Type
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.bodyType || ""} 
                onChange={(e) => onEditChange("bodyType", e.target.value.toUpperCase())} 
                placeholder="SEDAN"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Color
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.color || ""} 
                onChange={(e) => onEditChange("color", e.target.value.toUpperCase())} 
                placeholder="SILVER"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Plate Number
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.plateNo || editData.plate || ""} 
                onChange={(e) => onEditChange("plateNo", e.target.value.toUpperCase())} 
                placeholder="ABC-001"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Chassis Number
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.serialChassisNo || editData.chassisNo || ""} 
                onChange={(e) => onEditChange("serialChassisNo", e.target.value.toUpperCase())} 
                placeholder="CH123456789"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Motor Number
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.motorNo || ""} 
                onChange={(e) => onEditChange("motorNo", e.target.value.toUpperCase())} 
                placeholder="MOT987654321"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 MV File Number
              </label>
              <input 
                style={{...premiumInput, textTransform: "uppercase"}}
                className="premium-input"
                value={editData.mvFileNo || ""} 
                onChange={(e) => onEditChange("mvFileNo", e.target.value.toUpperCase())} 
                placeholder="MV2025001"
              />
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
              <input 
                style={premiumInput}
                className="premium-input"
                type="number"
                step="0.01"
                value={editData.premium?.toString().replace(/[₱,]/g, '') || ""} 
                onChange={(e) => {
                  const numValue = e.target.value;
                  onEditChange("premium", numValue);
                }}
                placeholder="0.00"
                min="0"
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Other Charges
              </label>
              <input 
                style={premiumInput}
                className="premium-input"
                type="number"
                step="0.01"
                value={editData.otherCharges?.toString().replace(/[₱,]/g, '') || ""} 
                onChange={(e) => {
                  const numValue = e.target.value;
                  onEditChange("otherCharges", numValue);
                }}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          <div style={divider}></div>

          {/* Tax & Fee Section */}
          <div style={infoBadge}>
            <FiCreditCard size={14} />
            Taxes & Fees (Auto-Calculated)
          </div>

          <div style={twoColumnContainer}>
            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Doc. Stamps (12.5%)
              </label>
              <input 
                style={{...premiumInput, backgroundColor: "#f3f4f6", cursor: "not-allowed"}}
                className="premium-input"
                value={editData.docStamps || "₱0.00"} 
                disabled
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 E-VAT (12%)
              </label>
              <input 
                style={{...premiumInput, backgroundColor: "#f3f4f6", cursor: "not-allowed"}}
                className="premium-input"
                value={editData.eVat || "₱0.00"} 
                disabled
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Local Govt Tax (0.5%)
              </label>
              <input 
                style={{...premiumInput, backgroundColor: "#f3f4f6", cursor: "not-allowed"}}
                className="premium-input"
                value={editData.localGovtTax || "₱0.00"} 
                disabled
              />
            </div>

            <div style={compactFieldGroup}>
              <label style={fieldLabel}>
                 Auth. Fee (Fixed)
              </label>
              <input 
                style={{...premiumInput, backgroundColor: "#f3f4f6", cursor: "not-allowed"}}
                className="premium-input"
                value={editData.authFee || "₱50.40"} 
                disabled
              />
            </div>
          </div>

          <div style={divider}></div>

          {/* Total Section */}
          <div style={infoBadge}>
            <FiCreditCard size={14} />
            Total Amount
          </div>

          <div style={{marginBottom: "0", backgroundColor: "#1e6b47", padding: "20px", borderRadius: "12px"}}>
            <label style={{...fieldLabel, color: "#ffffff"}}>
              💰 Grand Total
            </label>
            <div style={{fontSize: "28px", fontWeight: "900", color: "#ffffff"}}>
              {editData.grandTotal || "₱0.00"}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={premiumModalFooter}>
          <button 
            style={secondaryButton}
            className="premium-button secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            style={primaryButton}
            className="premium-button primary-button"
            onClick={onSave}
          >
            <FiEdit2 size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;