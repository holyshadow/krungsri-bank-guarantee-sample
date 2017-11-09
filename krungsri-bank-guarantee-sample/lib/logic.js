/**
 * BG Request
 * @param {com.krungsri.bg.RequestBGdoc} srDetail - 
 * @transaction
 */
function RequestBGdoc (srDetail){
    var factory = getFactory();
    var NS = 'com.krungsri.bg';
    var sr = factory.newResource(NS, 'BGdoc', srDetail.RequestId);

    var startDate = new Date(srDetail.startDate);
    var enddate = new Date(srDetail.endDate);
    sr.ProjectName = srDetail.ProjectName;
    sr.BGtype = srDetail.BGtype;
    sr.Servicetype = srDetail.Servicetype;
    sr.startDate = startDate;
    sr.endDate = enddate;
    sr.remark = srDetail.remark;
    sr.GuaranteeAmt = srDetail.GuaranteeAmt;
    sr.DocumentStatus = srDetail.DocumentStatus;
    sr.Bank = factory.newRelationship(NS, 'Organization', srDetail.Bank.orgId);
    sr.Beneficiary = factory.newRelationship(NS, 'Organization', srDetail.Beneficiary.orgId);
    sr.Requestor = factory.newRelationship(NS, 'Organization', srDetail.Requestor.orgId);
    
    return getAssetRegistry(NS + '.BGdoc')
    .then(function(srRegistry) {
        return srRegistry.add(sr);
    });
}


/**
 * Approve BG Request
 * @param {com.krungsri.bg.ApproveBGRequest} srDetail - 
 * @transaction
 */
function ApproveBGRequest (srDetail){
    var NS = 'com.krungsri.bg';
    var sr = srDetail.BGdoc;
    sr.DocumentStatus = "Complete";
    sr.BGstatus = "Approved"
    sr.BGId = srDetail.BGId;
    return getAssetRegistry(NS + '.BGdoc')
    .then(function(srRegistry) {
        return srRegistry.update(sr);
    });
}

/**
 * Reject BG Request
 * @param {com.krungsri.bg.RejectBGRequest} srDetail - 
 * @transaction
 */
function RejectBGRequest (srDetail){
    var NS = 'com.krungsri.bg';
    var sr = srDetail.BGdoc;
    sr.DocumentStatus = "Bank Reject";
    sr.BGstatus = "Reject"
    sr.remark = srDetail.remark;
    return getAssetRegistry(NS + '.BGdoc')
    .then(function(srRegistry) {
        return srRegistry.update(sr);
    });
}

/**
 * Return BG
 * @param {com.krungsri.bg.ReturnBG} srDetail - 
 * @transaction
 */
function ReturnBG (srDetail){
    var NS = 'com.krungsri.bg';
    var sr = srDetail.BGdoc;

    if (sr.BGstatus != "Approved" || sr.DocumentStatus != "Complete"){
        throw new Error('Invalid Document');
    }
    sr.DocumentStatus = "Bank Reject";
    var returnDate = new Date(srDetail.returnDate);
    sr.BGstatus = "Return"
    sr.returnDate = returnDate;
    return getAssetRegistry(NS + '.BGdoc')
    .then(function(srRegistry) {
        return srRegistry.update(sr);
    });
}