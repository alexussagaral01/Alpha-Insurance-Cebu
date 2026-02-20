import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/record.css";
import { FiEye, FiEdit2, FiTrash2, FiDownload, FiAlertCircle, FiRotateCcw, FiSearch } from "react-icons/fi";
import * as XLSX from "xlsx";
import Toast from "../../common/toast";
import ViewModal from "../button/view";
import EditModal from "../button/edit";

// Helper function to safely parse ISO date strings
const parseISODate = (dateString) => {
  if (!dateString) return "";
  const cleanDate = dateString.substring(0, 10);
  if (cleanDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return cleanDate;
  }
  return "";
};

// Helper function to transform a policy from API response to component format
const transformPolicy = (policy) => ({
  id: policy.id,
  name: policy.assured,
  assuredName: policy.assured,
  address: policy.address,
  policyNumber: policy.policy_number,
  pn: policy.policy_number,
  cocNumber: policy.coc_number,
  coc: policy.coc_number,
  orNumber: policy.or_number,
  or: policy.or_number,
  model: policy.model,
  fromDate: parseISODate(policy.insurance_from_date),
  toDate: parseISODate(policy.insurance_to_date),
  issued: parseISODate(policy.date_issued),
  received: parseISODate(policy.date_received),
  make: policy.make,
  bodyType: policy.body_type,
  color: policy.color,
  plateNo: policy.plate_no,
  plate: policy.plate_no,
  chassisNo: policy.chassis_no,
  motorNo: policy.motor_no,
  mvFileNo: policy.mv_file_no,
  premium: `₱${parseFloat(policy.premium).toFixed(2)}`,
  otherCharges: `₱${parseFloat(policy.other_charges).toFixed(2)}`,
  docStamps: `₱${parseFloat(policy.doc_stamps).toFixed(2)}`,
  eVat: `₱${parseFloat(policy.e_vat).toFixed(2)}`,
  localGovtTax: `₱${parseFloat(policy.lgt).toFixed(2)}`,
  authFee: `₱${parseFloat(policy.auth_fee).toFixed(2)}`,
  grandTotal: `₱${parseFloat(policy.total_premium).toFixed(2)}`,
  dateCreated: policy.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
  cType: policy.policy_type,
  year: policy.policy_year,
  serialChassisNo: policy.chassis_no
});

const Records = () => {
  const [searchInput, setSearchInput] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState(null);
  const [originalEditData, setOriginalEditData] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  
  // Bulk selection states
  const [selectedRecords, setSelectedRecords] = useState(new Set());



  // Helper function to filter by date range (issued date)
  const performDateRangeFilter = (dataToFilter, fromDate, toDate, searchTerm) => {
    let results = [...dataToFilter];
    
    // First apply search filter if exists
    if (searchTerm && searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(user => {
        const nameMatch = user.name ? String(user.name).trim().toLowerCase().startsWith(searchLower) : false;
        const formattedPn = `${user.cType || ""}${user.cType ? "-" : ""}${user.pn || ""}${user.year ? "/" + user.year : ""}`.toLowerCase();
        const pnMatch = formattedPn ? formattedPn.startsWith(searchLower) : false;
        const rawPnMatch = user.pn ? String(user.pn).trim().toLowerCase().startsWith(searchLower) : false;
        const cocMatch = user.coc ? String(user.coc).trim().toLowerCase().startsWith(searchLower) : false;
        const orMatch = user.or ? String(user.or).trim().toLowerCase().startsWith(searchLower) : false;
        const plateMatch = user.plate ? String(user.plate).trim().toLowerCase().startsWith(searchLower) : false;
        return nameMatch || pnMatch || rawPnMatch || cocMatch || orMatch || plateMatch;
      });
    }
    
    // Then apply date range filter based on issued date
    // Show records where issued date falls within the selected date range (inclusive)
    results = results.filter(user => {
      if (!user.issued) return false;
      // Check if issued date is within the selected range
      return user.issued >= fromDate && user.issued <= toDate;
    });
    
    setFilteredUsers(results);
    setIsSearchActive(true);
    setCurrentPage(1);
  };

  // Helper function to perform search only
  const performSearch = (dataToSearch, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredUsers([]);
      setIsSearchActive(false);
      setCurrentPage(1);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const results = dataToSearch.filter(user => {
      const nameMatch = user.name ? String(user.name).trim().toLowerCase().startsWith(searchLower) : false;
      const formattedPn = `${user.cType || ""}${user.cType ? "-" : ""}${user.pn || ""}${user.year ? "/" + user.year : ""}`.toLowerCase();
      const pnMatch = formattedPn ? formattedPn.startsWith(searchLower) : false;
      const rawPnMatch = user.pn ? String(user.pn).trim().toLowerCase().startsWith(searchLower) : false;
      const cocMatch = user.coc ? String(user.coc).trim().toLowerCase().startsWith(searchLower) : false;
      const orMatch = user.or ? String(user.or).trim().toLowerCase().startsWith(searchLower) : false;
      const plateMatch = user.plate ? String(user.plate).trim().toLowerCase().startsWith(searchLower) : false;
      return nameMatch || pnMatch || rawPnMatch || cocMatch || orMatch || plateMatch;
    });
    
    setFilteredUsers(results);
    setIsSearchActive(true);
    setCurrentPage(1);
  };

  // Handle FROM date change - just update state
  const handleFromDateChange = (e) => {
    setDateFrom(e.target.value);
  };

  // Handle TO date change - just update state
  const handleToDateChange = (e) => {
    setDateTo(e.target.value);
  };

  // Apply date filter when user clicks Apply button
  const handleApplyDateFilter = () => {
    if (dateFrom !== "" && dateTo !== "") {
      performDateRangeFilter(users, dateFrom, dateTo, searchInput);
    } else {
      setToast({ message: 'Please select both From and To dates', type: 'error' });
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setDateFrom("");
    setDateTo("");
    setSearchInput("");
    setFilteredUsers([]);
    setIsSearchActive(false);
    setCurrentPage(1);
  };



  // Fetch policies from database on component mount and set up auto-refresh
  useEffect(() => {
    // Function to fetch without showing loading (for polling)
    const fetchPoliciesQuiet = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const username = localStorage.getItem('user');
        const adminId = localStorage.getItem('adminId');
        const response = await fetch(`${apiUrl}/policies`, {
          headers: {
            'x-username': username,
            'x-admin-id': adminId
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch policies: ${response.statusText}`);
        }

        const data = await response.json();
        const transformedPolicies = (data.data || []).map(transformPolicy);
        setUsers(transformedPolicies);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    // Initial fetch with loading indicator
    const fetchPoliciesInitial = async () => {
      try {
        setIsLoading(true);
        await fetchPoliciesQuiet();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    // Fetch initial data (shows loading)
    fetchPoliciesInitial();

    // Set up auto-refresh polling every 5 seconds (no loading popup)
    const pollInterval = setInterval(fetchPoliciesQuiet, 5000);

    // Cleanup function
    return () => {
      clearInterval(pollInterval);
    };
  }, []);
  
  const handleAddClick = () => {
    // Grant access to menu when Add button is clicked
    sessionStorage.setItem('menuAccessGranted', 'true');
    navigate('/menu');
  };

  const handleLogout = () => {
    // Clear any stored session/auth data if applicable
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSession');
    localStorage.removeItem('user');
    localStorage.removeItem('adminId');
    // Clear menu access flag
    sessionStorage.removeItem('menuAccessGranted');
    // Navigate to login page
    navigate('/');
  };

  // Logout button style
  const logoutButtonStyle = {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#ffffff',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0',
    boxShadow: '0 6px 20px rgba(220, 38, 38, 0.35), 0 0 0 3px rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'absolute',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    overflow: 'visible',
  };

  // Search function
  // items per page becomes selectable by admin (5 or 10)
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [windowStart, setWindowStart] = useState(1);

  const displayUsers = isSearchActive ? filteredUsers : users;
  const totalPages = Math.max(1, Math.ceil(displayUsers.length / itemsPerPage));

  // Sliding window pagination: show only 3 pages at a time
  const WINDOW_SIZE = 3;
  const windowEnd = Math.min(windowStart + WINDOW_SIZE - 1, totalPages);
  const visiblePages = Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => windowStart + i);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [displayUsers.length, currentPage, totalPages]);

  // Adjust window when current page changes
  useEffect(() => {
    if (currentPage < windowStart) {
      setWindowStart(Math.max(1, currentPage - WINDOW_SIZE + 1));
    } else if (currentPage > windowEnd) {
      setWindowStart(currentPage);
    }
  }, [currentPage, windowStart, windowEnd]);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentUsers = displayUsers.slice(startIdx, startIdx + itemsPerPage);

  const goToPage = (n) => {
    const newPage = Math.min(Math.max(1, n), totalPages);
    setCurrentPage(newPage);
    
    // Shift window if clicking the last visible page
    if (newPage === windowEnd && windowEnd < totalPages) {
      setWindowStart(newPage);
    }
  };
  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  const openView = (user) => {
    setSelectedUser(user);
    setModalType("view");
    setModalOpen(true);
  };

const openEdit = (user) => {
  // Strip currency symbols from premium and other charges
  const premiumNum = parseFloat(user.premium?.toString().replace(/[₱,]/g, '')) || 0;
  const otherChargesNum = parseFloat(user.otherCharges?.toString().replace(/[₱,]/g, '')) || 0;
  
  const initialEdit = { 
    ...user, 
    premium: premiumNum,
    otherCharges: otherChargesNum,
    // Keep year for payload construction
    year: user.year,
    // PRESERVE NULL VALUES - don't convert to "N/A" here
    // The form will display placeholder text, but the actual data remains null
    cocNumber: user.cocNumber !== null && user.cocNumber !== undefined ? user.cocNumber : null,
    orNumber: user.orNumber !== null && user.orNumber !== undefined ? user.orNumber : null,
    policyNumber: user.policyNumber || user.pn,
    plateNo: user.plateNo || user.plate,
    serialChassisNo: user.serialChassisNo || user.chassisNo
  };
  
  setSelectedUser(user);
  setEditData(initialEdit);
  setOriginalEditData(JSON.parse(JSON.stringify(initialEdit))); // Deep copy
  setModalType("edit");
  setModalOpen(true);
};

  const openDeleteConfirm = (user) => {
    setDeleteConfirmUser(user);
    setModalType("delete");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedUser(null);
    setEditData(null);
    setDeleteConfirmUser(null);
  };

  // Bulk selection handlers
  const toggleSelectRecord = (recordId) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRecords.size === displayUsers.length) {
      // Deselect all
      setSelectedRecords(new Set());
    } else {
      // Select all records in filtered results
      const allIds = new Set(displayUsers.map(u => u.id));
      setSelectedRecords(allIds);
    }
  };

  const openBulkDeleteConfirm = () => {
    if (selectedRecords.size === 0) {
      setToast({ message: 'No records selected for deletion', type: 'error' });
      return;
    }
    setModalType("bulkDelete");
    setModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedRecords.size === 0) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const username = localStorage.getItem('user');
      const adminId = localStorage.getItem('adminId');

      // Delete each selected record
      const deletePromises = Array.from(selectedRecords).map(recordId =>
        fetch(`${apiUrl}/policies/${recordId}`, {
          method: 'DELETE',
          headers: {
            'x-username': username,
            'x-admin-id': adminId
          }
        })
      );

      const responses = await Promise.all(deletePromises);
      
      // Check if all deletions were successful
      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete some records');
        }
      }

      // Update users list by removing deleted records
      setUsers((prev) => {
        const newUsers = prev.filter((u) => !selectedRecords.has(u.id));
        setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil(newUsers.length / itemsPerPage))));
        return newUsers;
      });

      const count = selectedRecords.size;
      setToast({ message: `${count} record(s) deleted successfully`, type: 'success' });
      setSelectedRecords(new Set());
      closeModal();
    } catch (error) {
      console.error('Error bulk deleting policies:', error);
      setToast({ message: `Failed to delete records: ${error.message}`, type: 'error' });
    }
  };

  // Real-time calculation handler for edit
  const handleEditChange = (field, value) => {
    const updated = { ...editData, [field]: value };
    
    // Auto-calculate taxes when premium or other charges change
    if (field === 'premium' || field === 'otherCharges') {
      const premiumNum = parseFloat(updated.premium) || 0;
      const otherChargesNum = parseFloat(updated.otherCharges) || 0;
      const subtotal = premiumNum + otherChargesNum;
      
      // Calculate taxes
      const docStamps = subtotal * 0.125; // 12.5%
      const eVat = subtotal * 0.12; // 12%
      const localGovtTax = subtotal * 0.005; // 0.5%
      const authFee = 50.40; // Fixed
      const totalPremium = subtotal + docStamps + eVat + localGovtTax + authFee;
      
      setEditData({
        ...updated,
        docStamps: docStamps > 0 ? `₱${docStamps.toFixed(2)}` : '₱0.00',
        eVat: eVat > 0 ? `₱${eVat.toFixed(2)}` : '₱0.00',
        localGovtTax: localGovtTax > 0 ? `₱${localGovtTax.toFixed(2)}` : '₱0.00',
        authFee: `₱${authFee.toFixed(2)}`,
        grandTotal: totalPremium > 0 ? `₱${totalPremium.toFixed(2)}` : '₱0.00'
      });
    } else {
      setEditData(updated);
    }
  };

    const handleSaveEdit = async () => {
      if (!editData) return;
      
      // Check if anything actually changed
      const fieldsToCheck = [
        'assuredName', 'name', 'address', 'cocNumber', 'coc', 'orNumber', 'or',
        'policyNumber', 'pn', 'cType', 'year', 'issued', 'received',
        'fromDate', 'toDate', 'model', 'make', 'bodyType', 'color',
        'mvFileNo', 'plateNo', 'plate', 'serialChassisNo', 'chassisNo', 'motorNo',
        'premium', 'otherCharges', 'docStamps', 'eVat', 'localGovtTax', 'authFee', 'grandTotal'
      ];
      
      let hasChanges = false;
      for (let field of fieldsToCheck) {
        const originalVal = originalEditData?.[field];
        const currentVal = editData[field];
        if (originalVal !== currentVal) {
          hasChanges = true;
          break;
        }
      }
      
      if (!hasChanges) {
        setToast({ message: 'No changes were made', type: 'info' });
        setModalOpen(false);
        return;
      }
      
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        // Extract numeric values
        const premiumNum = parseFloat(editData.premium) || 0;
        const otherChargesNum = parseFloat(editData.otherCharges) || 0;
        const docStampsNum = parseFloat(editData.docStamps?.toString().replace(/[₱,]/g, '')) || 0;
        const eVatNum = parseFloat(editData.eVat?.toString().replace(/[₱,]/g, '')) || 0;
        const localGovtTaxNum = parseFloat(editData.localGovtTax?.toString().replace(/[₱,]/g, '')) || 0;
        const authFeeNum = parseFloat(editData.authFee?.toString().replace(/[₱,]/g, '')) || 50.40;
        const totalPremiumNum = parseFloat(editData.grandTotal?.toString().replace(/[₱,]/g, '')) || 0;
        
        const policyYear = editData.year || parseInt(editData.model?.split(' ')[0]) || new Date().getFullYear();
        
        // Helper to trim and keep value
        const trimValue = (val) => {
          return String(val || "").trim();
        };
        
        // Helper to return null for empty strings (for optional fields)
        const nullIfEmpty = (val) => {
          const trimmed = trimValue(val);
          return trimmed === "" ? null : trimmed;
        };
        
        const payload = {
          assured: trimValue(editData.assuredName || editData.name) || "N/A",
          address: trimValue(editData.address) || "N/A",
          coc_number: nullIfEmpty(editData.cocNumber),
          or_number: nullIfEmpty(editData.orNumber),
          policy_number: trimValue(editData.policyNumber || editData.pn) || "N/A",
          policy_type: trimValue(editData.cType) || "N/A",
          policy_year: policyYear,
          date_issued: editData.issued || "0000-00-00",
          date_received: editData.received || "0000-00-00",
          insurance_from_date: editData.fromDate || "0000-00-00",
          insurance_to_date: editData.toDate || "0000-00-00",
          model: trimValue(editData.model) || "N/A",
          make: trimValue(editData.make) || "N/A",
          body_type: trimValue(editData.bodyType) || "N/A",
          color: trimValue(editData.color) || "N/A",
          mv_file_no: nullIfEmpty(editData.mvFileNo),
          plate_no: nullIfEmpty(editData.plateNo || editData.plate),
          chassis_no: nullIfEmpty(editData.serialChassisNo || editData.chassisNo),
          motor_no: nullIfEmpty(editData.motorNo),
          premium: premiumNum,
          other_charges: otherChargesNum,
          doc_stamps: docStampsNum,
          e_vat: eVatNum,
          lgt: localGovtTaxNum,
          auth_fee: authFeeNum,
          total_premium: totalPremiumNum
        };

        console.log('Payload being sent:', JSON.stringify(payload, null, 2));

        const username = localStorage.getItem('user');
        const adminId = localStorage.getItem('adminId');
        const response = await fetch(`${apiUrl}/policies/${editData.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'x-username': username,
            'x-admin-id': adminId
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Backend error response:', errorData);
          throw new Error(errorData.message || 'Failed to update policy');
        }

        // Refetch all policies to get latest data from database
        const fetchResponse = await fetch(`${apiUrl}/policies`, {
          headers: {
            'x-username': username,
            'x-admin-id': adminId
          }
        });
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          const transformedPolicies = (data.data || []).map(policy => ({
            id: policy.id,
            name: policy.assured,
            assuredName: policy.assured,
            address: policy.address,
            policyNumber: policy.policy_number,
            pn: policy.policy_number,
            cocNumber: policy.coc_number,
            coc: policy.coc_number,
            orNumber: policy.or_number,
            or: policy.or_number,
            model: policy.model,
            fromDate: parseISODate(policy.insurance_from_date),
            toDate: parseISODate(policy.insurance_to_date),
            issued: parseISODate(policy.date_issued),
            received: parseISODate(policy.date_received),
            make: policy.make,
            bodyType: policy.body_type,
            color: policy.color,
            plateNo: policy.plate_no,
            plate: policy.plate_no,
            chassisNo: policy.chassis_no,
            motorNo: policy.motor_no,
            mvFileNo: policy.mv_file_no,
            premium: `₱${parseFloat(policy.premium).toFixed(2)}`,
            otherCharges: `₱${parseFloat(policy.other_charges).toFixed(2)}`,
            docStamps: `₱${parseFloat(policy.doc_stamps).toFixed(2)}`,
            eVat: `₱${parseFloat(policy.e_vat).toFixed(2)}`,
            localGovtTax: `₱${parseFloat(policy.lgt).toFixed(2)}`,
            authFee: `₱${parseFloat(policy.auth_fee).toFixed(2)}`,
            grandTotal: `₱${parseFloat(policy.total_premium).toFixed(2)}`,
            dateCreated: policy.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
            cType: policy.policy_type,
            year: policy.policy_year,
            serialChassisNo: policy.chassis_no
          }));
          setUsers(transformedPolicies);
        }

        setToast({ message: 'Record updated successfully!', type: 'success' });
        closeModal();
      } catch (error) {
        console.error('Error updating policy:', error);
        setToast({ message: `Failed to update record: ${error.message}`, type: 'error' });
      }
    };

  const confirmDelete = async () => {
    if (!deleteConfirmUser) return;
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const username = localStorage.getItem('user');
      const adminId = localStorage.getItem('adminId');
      const response = await fetch(`${apiUrl}/policies/${deleteConfirmUser.id}`, {
        method: 'DELETE',
        headers: {
          'x-username': username,
          'x-admin-id': adminId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete policy');
      }

      const deletedName = deleteConfirmUser.name;
      setUsers((prev) => {
        const newUsers = prev.filter((u) => u.id !== deleteConfirmUser.id);
        setCurrentPage((p) => Math.min(p, Math.max(1, Math.ceil(newUsers.length / itemsPerPage))));
        return newUsers;
      });
      setToast({ message: `Record for "${deletedName}" deleted successfully`, type: 'success' });
      closeModal();
    } catch (error) {
      console.error('Error deleting policy:', error);
      setToast({ message: `Failed to delete record: ${error.message}`, type: 'error' });
    }
  };

  // Define header cell style with proper borders for sticky behavior
  const headerStyle = {
    position: "sticky",
    top: 0,
    backgroundColor: "#1e6b47",
    color: "#ffffff",
    padding: "18px 16px",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    zIndex: 10,
    boxShadow: "0 2px  rgba(0,0,0,0.15)",
    borderTop: "2px solid #165638",
    borderBottom: "2px solid #165638"
  };

  const noBorderStyle = { border: "none" };

  const premiumModalBackdrop = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.25s ease-out"
  };

  const premiumModal = {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    width: "95%",
    maxWidth: "1000px",
    maxHeight: "95vh",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.05)",
    animation: "slideUpScale 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
    display: "flex",
    flexDirection: "column"
  };

  const premiumModalHeader = {
    padding: "40px 48px",
    borderBottom: "1px solid rgba(229, 231, 235, 0.8)",
    background: "linear-gradient(135deg, #1e6b47 0%, #267d57 50%, #2f9268 100%)",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden"
  };

  const premiumModalTitle = {
    fontSize: "26px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    position: "relative",
    zIndex: 1
  };

  const premiumModalBody = {
    padding: "48px",
    overflowY: "auto",
    flex: 1,
    backgroundColor: "#fafafa"
  };

  const premiumModalFooter = {
    padding: "32px 48px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "flex-end",
    gap: "14px",
    backgroundColor: "#ffffff"
  };

  const fieldGroup = {
    marginBottom: "28px"
  };

  const fieldLabel = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  };

  const fieldValue = {
    padding: "16px 18px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    fontSize: "16px",
    color: "#111827",
    border: "2px solid #e5e7eb",
    fontWeight: "500",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease"
  };

  const premiumInput = {
    width: "100%",
    padding: "16px 18px",
    fontSize: "16px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "inherit",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
  };

  const premiumButton = {
    padding: "13px 28px",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  };

  const primaryButton = {
    ...premiumButton,
    backgroundColor: "#1e6b47",
    color: "#ffffff"
  };

  const secondaryButton = {
    ...premiumButton,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "2px solid #e5e7eb"
  };

  const deleteButton = {
    ...premiumButton,
    backgroundColor: "#dc2626",
    color: "#ffffff"
  };

  const iconBadge = {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
  };

  const divider = {
    height: "1px",
    background: "linear-gradient(to right, transparent, #e5e7eb, transparent)",
    margin: "28px 0"
  };

  const infoBadge = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px"
  };

  // Export to Excel with Premium Formatting
  const exportToExcel = () => {
    const tableData = users.map(user => ({
      "Assured Name": user.name,
      "Address": user.address,
      "Policy Number": `${user.cType || "N/A"}-${user.pn || "N/A"}/${user.year || "N/A"}`,
      "COC Number": user.coc,
      "OR Number": user.or,
      "Model": user.model,
      "Make": user.make,
      "Body Type": user.bodyType,
      "Color": user.color,
      "Plate Number": user.plate,
      "MV File No": user.mvFileNo,
      "Chassis No": user.chassisNo,
      "Motor No": user.motorNo,
      "Premium": user.premium,
      "Other Charges": user.otherCharges,
      "Doc Stamps": user.docStamps,
      "E-VAT": user.eVat,
      "Local Govt Tax": user.localGovtTax,
      "Auth Fee": user.authFee,
      "Grand Total": user.grandTotal
    }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Insurance Records");
    
    worksheet["!cols"] = [
      { wch: 25 }, // Assured Name
      { wch: 30 }, // Address
      { wch: 15 }, // Policy Number
      { wch: 12 }, // COC Number
      { wch: 12 }, // OR Number
      { wch: 18 }, // Model
      { wch: 12 }, // Make
      { wch: 12 }, // Body Type
      { wch: 10 }, // Color
      { wch: 15 }, // Plate Number
      { wch: 15 }, // MV File No
      { wch: 18 }, // Chassis No
      { wch: 18 }, // Motor No
      { wch: 15 }, // Premium
      { wch: 15 }, // Other Charges
      { wch: 15 }, // Doc Stamps
      { wch: 12 }, // E-VAT
      { wch: 15 }, // Local Govt Tax
      { wch: 12 }, // Auth Fee
      { wch: 15 }  // Grand Total
    ];

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    
    // Style the header row (row 0) with green background
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      
      worksheet[cellAddress].s = {
        fill: {
          fgColor: { rgb: "1E6B47" } // Green background matching your theme
        },
        font: {
          bold: true,
          color: { rgb: "FFFFFF" }, // White text
          sz: 12,
          name: "Calibri"
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } }
        }
      };
    }

    // Style data rows with alternating colors
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const isEvenRow = (row - 1) % 2 === 0;
      
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
          fill: {
            fgColor: { rgb: isEvenRow ? "F3F4F6" : "FFFFFF" } // Alternating light gray and white
          },
          font: {
            sz: 11,
            color: { rgb: "000000" },
            name: "Calibri"
          },
          alignment: {
            horizontal: col === 0 || col === 1 ? "left" : "center", // Left align name and address
            vertical: "center",
            wrapText: true
          },
          border: {
            top: { style: "thin", color: { rgb: "E5E7EB" } },
            bottom: { style: "thin", color: { rgb: "E5E7EB" } },
            left: { style: "thin", color: { rgb: "E5E7EB" } },
            right: { style: "thin", color: { rgb: "E5E7EB" } }
          }
        };

        // Bold the Assured Name (col 0) and Grand Total (col 19) columns
        if (col === 0 || col === 19) {
          worksheet[cellAddress].s.font.bold = true;
          worksheet[cellAddress].s.font.sz = 11;
        }

        // Highlight Grand Total column with light green background
        if (col === 19) {
          worksheet[cellAddress].s.fill.fgColor = { rgb: "D1FAE5" };
        }

        // Highlight Premium column with light yellow background
        if (col === 13) {
          worksheet[cellAddress].s.fill.fgColor = { rgb: "FEF3C7" };
        }
      }
    }

    // Set row heights for better appearance
    worksheet["!rows"] = [];
    worksheet["!rows"][0] = { hpt: 30 }; // Header row height
    for (let i = 1; i <= range.e.r; i++) {
      worksheet["!rows"][i] = { hpt: 22 }; // Data row height
    }

    // Add autofilter to header row
    worksheet["!autofilter"] = { ref: `A1:T1` };

    XLSX.writeFile(workbook, `Alpha_Insurance_Records_${new Date().toISOString().split('T')[0]}.xlsx`);
    setToast({ message: 'Excel file with formatting exported successfully!', type: 'success' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container" style={{ 
        marginTop: '95px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        opacity: 0,
        animation: 'smoothFadeIn 1.4s ease-out forwards'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: '#ffffff', fontWeight: '600' }}>Loading records from database...</p>
        </div>
        <style>{`
          @keyframes smoothFadeIn {
            from { 
              opacity: 0;
              transform: translateY(10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {/* Navigation Bar with Logo and Logout - Same style as Menu */}
      <div style={{position: 'fixed', top: 0, left: 0, right: 0, maxWidth: '100%', margin: '0', padding: '0', width: '100%', zIndex: 999, boxShadow: '0 8px 24px rgba(45, 80, 22, 0.12)'}}>
        <div style={{background: '#fff', borderRadius: '2px', padding: '12px 20px', boxShadow: '0 8px 24px rgba(45, 80, 22, 0.12)', border: 'none', position: 'relative', overflow: 'visible'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', position: 'relative', zIndex: 1}}>
            {/* Left: logo + title */}
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div style={{flexShrink: 0, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src="/images/alpha.png" alt="Alpha Logo" style={{height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))'}} />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{display: 'flex', alignItems: 'baseline', gap: '8px'}}>
                  <h1 style={{fontSize: '22px', fontWeight: 900, color: '#1E6B47', margin: 0, letterSpacing: '-0.4px'}}>Records Management</h1>
                </div>
                <p style={{fontSize: '12px', color: '#1E6B47', margin: 0, fontWeight: 500}}>Motor Car Insurance · View and manage all policies</p>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '95px' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUpScale {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .premium-input:focus {
          border-color: #1e6b47 !important;
          box-shadow: 0 0 0 4px rgba(30, 107, 71, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          transform: translateY(-1px);
        }

        .premium-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18) !important;
        }

        .premium-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .secondary-button:hover {
          background-color: #e5e7eb !important;
          border-color: #d1d5db !important;
        }

        .primary-button:hover {
          background-color: #165638 !important;
          box-shadow: 0 8px 20px rgba(30, 107, 71, 0.3) !important;
        }

        .delete-button:hover {
          background-color: #b91c1c !important;
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3) !important;
        }

        .field-value-hover:hover {
          border-color: #d1d5db !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
        }

        .icon-badge-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .modal-header-decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 100%;
          background: radial-gradient(circle at 100% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .add-btn {
          background-color: #1e6b47 !important;
          border: none !important;
        }

        .add-btn:hover {
          background-color: #165638 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(30, 107, 71, 0.3) !important;
        }

        .page-size-btn.active {
          background-color: #1e6b47 !important;
          color: white !important;
          border: 2px solid #1e6b47 !important;
        }

        .page-size-btn:hover:not(.active) {
          background-color: #d4f0e8 !important;
          color: #1e6b47 !important;
          border-color: #1e6b47 !important;
        }

        .page-size-btn {
          transition: all 0.3s ease !important;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-dropdown {
          padding: 8px 12px;
          padding-right: 32px;
          font-size: 14px;
          font-weight: 600;
          border: 2px solid #1e6b47;
          border-radius: 6px;
          background-color: white;
          color: #1e6b47;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e6b47' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
        }

        .page-dropdown:hover {
          background-color: #d4f0e8;
          border-color: #165638;
        }

        .page-dropdown:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(30, 107, 71, 0.2);
        }

        .logout-btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
          box-shadow: 0 8px 28px rgba(220, 38, 38, 0.45), 0 0 0 4px rgba(255, 255, 255, 0.3) !important;
          filter: brightness(1.05);
        }

        .logout-btn:active {
          filter: brightness(0.95);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3) !important;
        }
      `}</style>

      {/* Navigation Header */}
      <div className="nav-header-container" style={{position: 'fixed', top: 0, left: 0, right: 0, width: '100%', maxWidth: '100%', margin: '0', padding: '0', zIndex: 999, boxShadow: '0 8px 24px rgba(45, 80, 22, 0.12)'}}>
        <div className="nav-header" style={{background: '#fff', borderRadius: '2px', padding: '12px 20px', boxShadow: '0 8px 24px rgba(45, 80, 22, 0.12)', border: 'none', position: 'relative', overflow: 'visible'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div className="logo" style={{flexShrink: 0, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src="/images/alpha.png" alt="Alpha Logo" style={{height: '60px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))'}} />
              </div>
              <div className="title" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <h1 style={{fontSize: '22px', fontWeight: 900, color: '#1E6B47', margin: 0, letterSpacing: '-0.4px'}}>Insurance Records</h1>
                <p style={{fontSize: '12px', color: '#1E6B47', margin: 0, fontWeight: 500}}>Motor Car Insurance · View & Manage Records</p>
              </div>
            </div>
          </div>
          <button 
            className="btn logout-btn" 
            onClick={handleLogout}
            style={logoutButtonStyle}
            title="Logout"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)} 
          duration={2000}
          showProgress={true}
        />
      )}

      <div className="top-bar">
        <div className="top-left">
          <button className="btn add-btn" onClick={handleAddClick} style={noBorderStyle}>ADD</button>
          {selectedRecords.size > 0 && (
            <span style={{ marginLeft: "16px", fontSize: "14px", color: "#1e6b47", fontWeight: "600" }}>
              {selectedRecords.size} selected
            </span>
          )}
        </div>
        <div className="top-right" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {selectedRecords.size > 0 && (
            <button 
              className="btn bulk-delete-btn" 
              onClick={openBulkDeleteConfirm}
              style={{
                ...noBorderStyle,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                backgroundColor: "#ef4444",
                color: "white",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
              title={`Delete ${selectedRecords.size} selected record(s)`}
            >
              <FiTrash2 size={18} /> Delete All
            </button>
          )}
          <button 
            className="btn export-btn" 
            onClick={exportToExcel}
            style={{
              ...noBorderStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              backgroundColor: "#10B981",
              color: "white",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#10B981"}
            title="Export to Excel"
          >
            <FiDownload size={18} /> Excel
          </button>
        </div>
      </div>

      <div className="search-bar">
        <div className="date-group" style={{ flexWrap: "nowrap" }}>
          <div className="field">
            <label>From</label>
            <input 
              type="date" 
              value={dateFrom}
              onChange={handleFromDateChange}
            />
          </div>

          <div className="field">
            <label>To</label>
            <input 
              type="date" 
              value={dateTo}
              onChange={handleToDateChange}
            />
          </div>

          <button
            onClick={handleApplyDateFilter}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "11px",
              backgroundColor: "#1e6b47",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              alignSelf: "flex-end",
              gap: "6px"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#165638"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#1e6b47"}
            title="Apply date filter"
          >
            <FiSearch size={16} />
          </button>

          <button
            onClick={handleResetFilters}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "11px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              alignSelf: "flex-end",
              gap: "6px"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
            title="Reset filters and show all records"
          >
            <FiRotateCcw size={16} />
          </button>

          <div className="field search-field">
            <label>Search</label>
            <div className="search-input-group" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => {
                  const newSearchValue = e.target.value.toUpperCase();
                  setSearchInput(newSearchValue);
                  
                  // Clear all filters if everything is empty
                  if (newSearchValue.trim() === "" && dateFrom === "" && dateTo === "") {
                    setFilteredUsers([]);
                    setIsSearchActive(false);
                    setCurrentPage(1);
                  } else if (dateFrom !== "" && dateTo !== "") {
                    // Both dates are set - use date range filter (which includes search filter)
                    performDateRangeFilter(users, dateFrom, dateTo, newSearchValue);
                  } else if (newSearchValue.trim() !== "") {
                    // Only search term is set - use search filter
                    performSearch(users, newSearchValue);
                  } else {
                    // Only one date is set or nothing - clear filters
                    setFilteredUsers([]);
                    setIsSearchActive(false);
                    setCurrentPage(1);
                  }
                }}
                placeholder="Enter name or plate no..."
                className="search-input"
                style={{ flex: 1, minWidth: "200px", textTransform: "uppercase" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              <th style={{ ...headerStyle, width: "50px", minWidth: "50px", textAlign: "center" }}>
                <input 
                  type="checkbox" 
                  checked={selectedRecords.size === displayUsers.length && displayUsers.length > 0}
                  onChange={handleSelectAll}
                  title={selectedRecords.size === displayUsers.length ? "Deselect all" : "Select all"}
                  style={{ cursor: "pointer", width: "18px", height: "18px" }}
                />
              </th>
              <th style={{ ...headerStyle, width: "20%", minWidth: "120px" }}>NAME</th>
              <th style={{ ...headerStyle, width: "22%", minWidth: "140px" }}>POLICY</th>
              <th style={{ ...headerStyle, width: "12%", minWidth: "100px" }}>COC</th>
              <th style={{ ...headerStyle, width: "12%", minWidth: "100px" }}>OR</th>
              <th style={{ ...headerStyle, width: "14%", minWidth: "110px" }}>PLATE NO</th>
              <th style={{ ...headerStyle, width: "10%", minWidth: "80px", textAlign: "center" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u) => (
              <tr key={u.id}>
                <td style={{ width: "50px", minWidth: "50px", textAlign: "center" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedRecords.has(u.id)}
                    onChange={() => toggleSelectRecord(u.id)}
                    title={selectedRecords.has(u.id) ? "Deselect" : "Select"}
                    style={{ cursor: "pointer", width: "18px", height: "18px" }}
                  />
                </td>
                <td style={{ width: "20%", minWidth: "120px" }}>{u.name}</td>
                <td style={{ width: "22%", minWidth: "140px" }}>{`${u.cType || "N/A"}-${u.pn || "N/A"}/${u.year || "N/A"}`}</td>
                <td style={{ width: "12%", minWidth: "100px" }}>{u.coc}</td>
                <td style={{ width: "12%", minWidth: "100px" }}>{u.or}</td>
                <td style={{ width: "14%", minWidth: "110px" }}>{u.plate}</td>
                <td style={{ width: "10%", minWidth: "80px", textAlign: "center" }}>
                  <button
                    className="action-btn view-btn"
                    title="View"
                    aria-label="View"
                    onClick={() => openView(u)}
                    style={noBorderStyle}
                  >
                    <FiEye />
                  </button>

                  <button
                    className="action-btn edit-btn"
                    title="Edit"
                    aria-label="Edit"
                    onClick={() => openEdit(u)}
                    style={noBorderStyle}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className="action-btn delete-btn"
                    title="Delete"
                    aria-label="Delete"
                    onClick={() => openDeleteConfirm(u)}
                    style={noBorderStyle}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginTop: "16px" 
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#ffffff", fontWeight: 600 }}>Show</span>
          <select
            className="page-size-select"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            aria-label="Items per page"
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: "8px",
              fontWeight: "700",
              background: "#ffffff",
              border: "2px solid #1e6b47",
              color: "#1e6b47",
              fontSize: "14px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231e6b47' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center"
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={1000}>1000</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button 
            className="page-btn" 
            onClick={handlePrev} 
            disabled={currentPage === 1} 
            style={{
              ...noBorderStyle,
              padding: "8px 16px",
              backgroundColor: currentPage === 1 ? "#e5e7eb" : "#059669",
              color: currentPage === 1 ? "#9ca3af" : "white",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Prev
          </button>

          {visiblePages.map((page) => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => goToPage(page)}
              style={{
                ...noBorderStyle,
                padding: "8px 12px",
                minWidth: "40px",
                backgroundColor: currentPage === page ? "#059669" : "#1e6b47",
                color: "#ffffff",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: currentPage === page ? "700" : "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                boxShadow: currentPage === page ? "0 4px 16px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.15)"
              }}
            >
              {page}
            </button>
          ))}

          <button 
            className="page-btn" 
            onClick={handleNext} 
            disabled={currentPage === totalPages} 
            style={{
              ...noBorderStyle,
              padding: "8px 16px",
              backgroundColor: currentPage === totalPages ? "#e5e7eb" : "#059669",
              color: currentPage === totalPages ? "#9ca3af" : "white",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {modalOpen && modalType === "view" && (
        <ViewModal 
          selectedUser={selectedUser}
          onClose={closeModal}
          premiumModalBackdrop={premiumModalBackdrop}
          premiumModal={premiumModal}
          premiumModalHeader={premiumModalHeader}
          premiumModalTitle={premiumModalTitle}
          premiumModalBody={premiumModalBody}
          premiumModalFooter={premiumModalFooter}
          secondaryButton={secondaryButton}
          infoBadge={infoBadge}
          fieldGroup={fieldGroup}
          fieldLabel={fieldLabel}
          fieldValue={fieldValue}
          divider={divider}
        />
      )}

      {modalOpen && modalType === "edit" && (
        <EditModal 
          editData={editData}
          onEditChange={handleEditChange}
          onSave={handleSaveEdit}
          onCancel={closeModal}
          premiumModalBackdrop={premiumModalBackdrop}
          premiumModal={premiumModal}
          premiumModalHeader={premiumModalHeader}
          premiumModalTitle={premiumModalTitle}
          premiumModalBody={premiumModalBody}
          premiumModalFooter={premiumModalFooter}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
          infoBadge={infoBadge}
          fieldGroup={fieldGroup}
          fieldLabel={fieldLabel}
          premiumInput={premiumInput}
          divider={divider}
        />
      )}

      {modalOpen && modalType === "delete" && deleteConfirmUser && (
        <div style={premiumModalBackdrop}>
          <div style={{
            ...premiumModal,
            width: "90%",
            maxWidth: "500px",
            maxHeight: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={premiumModalHeader}>
              <div className="modal-header-decoration"></div>
              <h3 style={premiumModalTitle}>
                <FiTrash2 size={30} />
                Delete Record
              </h3>
            </div>

            <div style={premiumModalBody}>
              <div style={{ textAlign: "center", padding: "20px 16px" }}>
                <div style={{
                  ...iconBadge,
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  margin: "0 auto 16px"
                }}
                className="icon-badge-pulse">
                  <FiTrash2 size={24} />
                </div>
                <h4 style={{ 
                  fontSize: "18px", 
                  fontWeight: "700", 
                  color: "#111827",
                  marginBottom: "10px" 
                }}>
                  Confirm Deletion
                </h4>
                <p style={{ 
                  fontSize: "0.9em",
                  color: "#6b7280", 
                  marginBottom: "8px",
                  lineHeight: "1.5"
                }}>
                  You are about to permanently delete the record for
                </p>
                <div style={{
                  padding: "12px 16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  margin: "12px 0",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#111827",
                    margin: 0
                  }}>
                    {deleteConfirmUser.name}
                  </p>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fbbf24",
                  borderRadius: "8px",
                  marginTop: "14px"
                }}>
                  <FiAlertCircle size={16} color="#92400e" />
                  <p style={{ 
                    fontSize: "13px",
                    color: "#92400e",
                    margin: 0,
                    fontWeight: "600"
                  }}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div style={premiumModalFooter}>
              <button 
                style={secondaryButton}
                className="premium-button secondary-button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button 
                style={deleteButton}
                className="premium-button delete-button"
                onClick={confirmDelete}
              >
                <FiTrash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && modalType === "bulkDelete" && (
        <div style={premiumModalBackdrop}>
          <div style={{
            ...premiumModal,
            width: "90%",
            maxWidth: "500px",
            maxHeight: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={premiumModalHeader}>
              <div className="modal-header-decoration"></div>
              <h3 style={premiumModalTitle}>
                <FiTrash2 size={30} />
                Bulk Delete Records
              </h3>
            </div>

            <div style={premiumModalBody}>
              <div style={{ textAlign: "center", padding: "20px 16px" }}>
                <div style={{
                  ...iconBadge,
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  margin: "0 auto 16px"
                }}
                className="icon-badge-pulse">
                  <FiTrash2 size={24} />
                </div>
                <h4 style={{ 
                  fontSize: "18px", 
                  fontWeight: "700", 
                  color: "#111827",
                  marginBottom: "10px" 
                }}>
                  Confirm Bulk Deletion
                </h4>
                <p style={{ 
                  fontSize: "0.9em",
                  color: "#6b7280", 
                  marginBottom: "12px",
                  lineHeight: "1.5"
                }}>
                  You are about to permanently delete
                </p>
                <div style={{
                  padding: "16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px",
                  margin: "12px 0",
                  border: "1px solid #e5e7eb"
                }}>
                  <p style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#ef4444",
                    margin: 0
                  }}>
                    {selectedRecords.size} record(s)
                  </p>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "10px 14px",
                  backgroundColor: "#fef3c7",
                  border: "1px solid #fbbf24",
                  borderRadius: "8px",
                  marginTop: "14px"
                }}>
                  <FiAlertCircle size={16} color="#92400e" />
                  <p style={{ 
                    fontSize: "13px",
                    color: "#92400e",
                    margin: 0,
                    fontWeight: "600"
                  }}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div style={premiumModalFooter}>
              <button 
                style={secondaryButton}
                className="premium-button secondary-button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button 
                style={deleteButton}
                className="premium-button delete-button"
                onClick={confirmBulkDelete}
              >
                <FiTrash2 size={16} />
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Records;