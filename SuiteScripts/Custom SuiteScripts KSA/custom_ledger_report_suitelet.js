function printLedgerAction(request, response) {
  if (request.getMethod() == 'GET') {         
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var accountid = request.getParameter('account');
    var accounttext = request.getParameter('accounttext');
    var fromdate = request.getParameter('fromdate');
    var fdate = nlapiStringToDate(fromdate);
    var from_date = fdate.getDate()+"-"+monthNames[fdate.getMonth()]+"-"+fdate.getFullYear();
    var subsidiary = request.getParameter('subsi');
    var todate = request.getParameter('todate');
    var tdate = nlapiStringToDate(todate);
    var to_date = tdate.getDate()+"-"+monthNames[tdate.getMonth()]+"-"+tdate.getFullYear();
    var subsi =  request.getParameter('subsi');
    var subrec = nlapiLoadRecord('subsidiary',subsi);
    var subsidiary = subrec.getFieldValue('legalname');
    var empledger = request.getParameter('empledger');
    var empname = request.getParameter('empname');

    var template = "" ;
    template += "<h4 align=\"center\" style=\"font-style:normal;height:2px;margin-top:30px;\">LEDGER REPORT</h4> ";
    template += '<table style="width:100%;font-size:12px;font-family:verdana,geneva,sans-serif;">';
    template += '<tr><td>&nbsp;</td></tr>';
    template += '<tr>';
    template += '<td style="width:15%;" align="left"><b>Account </b></td>';
    template += '<td style="width:1%;" align="left"><b>:</b></td>';
    template += '<td style="width:84%;" align="left">'+(accounttext)+'</td>';
    template += '</tr>';
    template += '</table>';
    template += '<table style="width:100%;font-size:12px;font-family:verdana,geneva,sans-serif;">';
    template += '<tr>';
    template += '<td style="width:15%;" align="left"><b>From</b></td>';
    template += '<td style="width:1%;" align="left"><b>:</b></td>';
    template += '<td style="width:17%;" align="left">'+from_date+'</td>';
    template += '<td style="width:10%;" align="center"><b>To</b></td>';
    template += '<td style="width:1%;" align="center"><b>:</b></td>';
    template += '<td style="width:22%;" align="left">'+to_date+'</td>';
    template += '<td style="width:18%;" align="right"><b>Currency</b></td>';
    template += '<td style="width:1%;" align="right"><b>:</b></td>';
    template += '<td style="width:13%;" align="left">AED</td>';
    template += '</tr>';
    if(empledger == "T"){
      var emprec = nlapiLoadRecord('employee',empname);
      var employeefirst = emprec.getFieldValue('firstname');
      var employeelast = emprec.getFieldValue('lastname');
      template += '<tr>';
      template += '<td style="width:15%;" align="left"><b>Employee</b></td>';
      template += '<td style="width:1%;" align="left"><b>:</b></td>';
      template += '<td style="width:17%;" align="left">'+employeefirst+' '+employeelast+'</td>';
      template += '</tr>';
    }
    template += '</table>';
    template += '<table style="width:100%;font-size:12px;font-family:verdana,geneva,sans-serif;">';
    template += '<tr>';
    template += '<td style="width:15%;" align="left"><b>Subsidiary </b></td>';
    template += '<td style="width:1%;" align="left"><b>:</b></td>';
    template += '<td style="width:84%;" align="left">'+subsidiary+'</td>';
    template += '</tr>';
    template += '<tr><td>&nbsp;</td></tr>';
    template += '</table>';
    if(empledger == "T"){
      var ledgerfilter = [['account','anyof',accountid],'And',['trandate','onorafter',fromdate],'And',['trandate','onorbefore',todate],'And',['custcol_employee','anyof',empname],'Or',['entity','anyof',empname]];
      var balancefilter = [['account','anyof',accountid],'And',['trandate','before',fromdate],'And',[['custcol_employee','anyof',empname],'Or',['entity','anyof',empname]]];
    }else{
       var ledgerfilter = [['account','anyof',accountid],'And',['trandate','onorafter',fromdate],'And',['trandate','onorbefore',todate],'And',['subsidiary','anyof',subsi]];
    var balancefilter = [['account','anyof',accountid],'And',['trandate','before',fromdate],'And',['subsidiary','anyof',subsi]];
    }
    var ledgerreport = nlapiSearchRecord('transaction', 'customsearch_ledger_report',ledgerfilter);
    var balanceforward = nlapiSearchRecord('transaction', 'customsearch_ledger_report_balance_forwa',balancefilter);

    template += '<table style="width:100%;font-family:verdana,geneva,sans-serif;font-size:8px;">';
    template += '<tr style="font-family:verdana,geneva,sans-serif;font-size:12px;font-weight:bold;">';
    template += '<td align="center" style="padding:4px;border-top:1px solid black;border-bottom:1px solid black;" colspan = "2">DATE</td>';
    template += '<td align="center" style="padding:4px;border-top:1px solid black;border-bottom:1px solid black;" colspan = "4">NAME</td>';
    template += '<td align="center" style="padding:4px;border-top:1px solid black;border-bottom:1px solid black;" colspan = "3">TYPE</td>';
    template += '<td align="center" style="padding:4px;border-top:1px solid black;border-bottom:1px solid black;" colspan = "3">REF. NO.</td>';
    template += '<td align="center" style="padding:4px;border-top:1px solid black;border-bottom:1px solid black;" colspan = "3">DEBIT</td>';
    template += '<td align="center" style="padding:4px;border-top:1px solid black;border-bottom:1px solid black;" colspan = "3">CREDIT</td>';				
    template += '<td align="center" style="padding:4px;border-top:1px solid black;border-bottom:1px solid black;" colspan = "3">BALANCE</td>';
    template += '</tr>';
    var amount = 0;
    var debittotal = 0;
    var credittotal = 0;
    var debitsum = 0;
    var creditsum = 0;
    var balance = 0;
    var balanceamt = 0;
    var debitamount = 0;
    var creditamount = 0;

    if(balanceforward){
      for(var j=0;j<balanceforward.length;j++){
        debitsum = + debitsum + +balanceforward[j].getValue('debitamount',null,'sum');
        creditsum = + creditsum + +balanceforward[j].getValue('creditamount',null,'sum');
      }
      balance = + debitsum - + creditsum;
      template += '<tr style="font-family:verdana,geneva,sans-serif;font-size:10px;"><td colspan="4" align="left" style="font-size:10px;font-weight:bold;font-weight:bold;border-bottom:solid 1px black">Balance forward</td><td colspan="14" style="border-bottom:solid 1px black;">&nbsp;</td><td align="center" style="font-size:10px;font-weight:bold;align:center;border-bottom:solid 1px black;" colspan="3">'+numberWithCommas(balance.toFixed(2))+'</td></tr>';
    }else{
      template += '<tr style="font-family:verdana,geneva,sans-serif;font-size:10px;"><td colspan="4" align="center" style="font-size:10px;font-weight:bold;font-weight:bold;border-bottom:solid 1px black">Balance forward</td><td colspan="14" style="border-bottom:solid 1px black;">&nbsp;</td><td align="center" style="font-size:10px;font-weight:bold;align:center;border-bottom:solid 1px black;" colspan="3">'+numberWithCommas(balance.toFixed(2))+'</td></tr>';
    }
    if(ledgerreport){

      for(var i=0;i<ledgerreport.length;i++){
        var entityname = ledgerreport[i].getText("mainname");
        if(entityname){
          entityname = relaceCharector(entityname);
        }else{
          entityname = '';
        }
        var refno = ledgerreport[i].getValue("tranid");
        var insrefno = ledgerreport[i].getValue("custbody_custom_id");
        if(refno){
          refno = relaceCharector(refno);
        }else if(insrefno){
          refno = insrefno;
        }
        var amount = ledgerreport[i].getValue("amount");
        var tran_date = nlapiStringToDate(ledgerreport[i].getValue("trandate"));
        var tr_date = tran_date.getDate()+"-"+monthNames[tran_date.getMonth()]+"-"+tran_date.getFullYear();
        var debitamount = (ledgerreport[i].getValue("debitamount"));
        var creditamount = (ledgerreport[i].getValue("creditamount"));
        if(amount != 0){
          template += '<tr style="font-family:verdana,geneva,sans-serif;font-size:10px;">';
          template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "2">'+tr_date+'</td>';
          template += '<td align="left" style="padding:4px;border-bottom:1px solid black;" colspan = "4">'+entityname+'</td>';
          template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "3">'+relaceCharector(ledgerreport[i].getText("type"))+'</td>';

          template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "3">'+refno+'</td>';
          if(debitamount != 0){
            template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "3">'+numberWithCommas(debitamount)+'</td>';
            debittotal = +debittotal + +debitamount;
          }else{
            template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "3">&nbsp;</td>';
          }
          if(creditamount != 0){
            template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "3">'+numberWithCommas(creditamount)+'</td>';
            credittotal = +credittotal + +creditamount;
          }else{
            template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "3">&nbsp;</td>';
          }
          if(i==0){
            balanceamt = +balanceamt + +balance + +debitamount - +creditamount;
            template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "3">'+numberWithCommas(balanceamt.toFixed(2))+'</td>';
          }else{
            balanceamt =  +balanceamt + +debitamount - +creditamount;
            template += '<td align="center" style="padding:4px;border-bottom:1px solid black;" colspan = "3">'+numberWithCommas(balanceamt.toFixed(2))+'</td>';
          }
          template += '</tr>';
        }

      }
    }
    template += '<tr>';
    template += '<td colspan="2" style="font-size:10px;font-weight:bold;font-weight:bold;border-bottom:solid 0.2px #e3e3e3;" align="center">Total</td>';
    template += '<td colspan="10" style="font-size:10px;font-weight:bold;font-weight:bold;border-bottom:solid 0.2px #e3e3e3;" align="center">&nbsp;</td>';
    template += '<td align="center" style="font-size:10px;font-weight:bold;align:center;border-bottom:1px solid black;" colspan = "3">'+numberWithCommas(debittotal.toFixed(2))+'</td>';
    template += '<td align="center" style="font-size:10px;font-weight:bold;align:center;border-bottom:1px solid black;" colspan = "3">'+numberWithCommas(credittotal.toFixed(2))+'</td>';
    template += '<td align="center" style="font-size:10px;font-weight:bold;align:center;border-bottom:1px solid black;" colspan = "3">'+numberWithCommas(balanceamt.toFixed(2))+'</td>';
    template += '</tr>';
    template += '</table>';
    var xml = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd" [<!ENTITY nbsp "&#160;">] >'; // start of template
    xml += '<pdf>';
    xml += '<head>'; 
    xml += '<style>td p { align:left; }</style>';

    xml += '</head>';
    xml += '<body header-height="13%" footer-height="5%" padding="0.4in 0.4in 0.4in 0.4in" size="Letter" style="font-family:verdana,geneva,sans-serif;">';

    xml += template;
    xml += '</body>';
    xml += '</pdf>';

    // run the BFO library to convert the xml document to a PDF 
    var file = nlapiXMLToPDF(xml);
    // set content type, file name, and content-disposition (inline means display in browser)

    response.setContentType('PDF', 'ledgerReport.pdf','inline');
    response.write(file.getValue());   
  }
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function relaceCharector(charVal){
    return  charVal.replace(/&/g, "&amp;");

  }
}