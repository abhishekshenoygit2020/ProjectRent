  function vendorStatementAction(request, response) {

    if (request.getMethod() == 'GET') {
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var vendorID = request.getParameter('vendor');
      var statement_date = request.getParameter('stat_date');
      var st_date = nlapiStringToDate(statement_date);
      var stat_date = st_date.getDate() + "-" + monthNames[st_date.getMonth()] + "-" + st_date.getFullYear();
      var cur = request.getParameter('currency_sel');
      var currency_text = request.getParameter('currency_text');
      var subsidiary = request.getParameter('subsi');
      var curt_date = request.getParameter('cur_date');
      var cur_date = nlapiStringToDate(curt_date);
      var current_date = cur_date.getDate() + "-" + monthNames[cur_date.getMonth()] + "-" + cur_date.getFullYear();

      var vendRec = nlapiLoadRecord('vendor', vendorID);
      var vendId = vendRec.getFieldValue('entityid');
      if (vendRec.getFieldValue('companyname')) {
        var company_name = relaceCharector(vendRec.getFieldValue('altname'));
      } else {
        var company_name = '';
      }
      if (vendRec.getFieldValue('defaultaddress')) {
        var customer_add = relaceCharector(vendRec.getFieldValue('defaultaddress'));
      } else {
        var customer_add = '';
      }
      var phone_num = vendRec.getFieldValue('phone');
      var fax_num = vendRec.getFieldValue('fax');
      var credit_lim = vendRec.getFieldValue('creditlimit');
      var credit_days = vendRec.getFieldText('terms');

      var subrec = nlapiLoadRecord('subsidiary', subsidiary);
      var subs_legal_name = subrec.getFieldValue('legalname');
      var subs_ph = subrec.getFieldValue('addrphone');
      var subs_fax = subrec.getFieldValue('fax');
      var subs_add = subrec.getFieldValue('mainaddress_text');
      // nlapiLogExecution('DEBUG', 'subs_legal_name', subs_legal_name);
      // nlapiLogExecution('DEBUG', 'subs_ph', subs_ph);
      // nlapiLogExecution('DEBUG', 'subs_fax', subs_fax);
      // nlapiLogExecution('DEBUG', 'subs_add', subs_add);

      var template = "";

      template += "";
      
      template += "<h4 align=\"center\" style=\"font-style:normal;height:2px;\">STATEMENT OF ACCOUNT</h4> ";
      template += '<table style="width:100%;"><tr>';
      template += '<td style="width:50%;height:50px;">';
      template += '<table style="margin-top: 20px;font-size:12px;font-family:verdana,geneva,sans-serif;align:left;width:60%;">';
      template += '<tr><td></td></tr>';
      template += '<tr><td colspan = "1"><b>To</b></td><td colspan = "1"><b>:</b>&nbsp;</td><td colspan = "7">' + company_name + '</td></tr>';
      if (customer_add == null) {
        template += '<tr><td></td></tr>';
      }
      else {
        template += '<tr><td colspan = "2"></td><td colspan = "7">' + relaceCharector(customer_add) + '</td></tr>';
      }
      if (phone_num == null) {
        template += '<tr><td></td></tr>';
      }
      else {
        template += '<tr><td colspan = "2"></td><td colspan = "7">Ph <b>:</b>' + phone_num + '</td></tr>';
      }
      if (fax_num == null) {
        template += '<tr><td></td></tr>';
      }
      else {
        template += '<tr><td colspan = "2"></td><td colspan = "7">Fax <b>:</b>' + fax_num + '</td></tr>';
      }
      template += '</table>';
      template += '</td>';
      template += '<td style="width:50%;height:50px;" align="right">';
                template += '<table style="margin-top: 20px;font-size:12px;font-family:verdana,geneva,sans-serif;">';
                template += '<tr><td></td></tr>';
                template += '<tr><td colspan = "1"><b>From</b></td><td colspan = "1"><b>:</b>&nbsp;</td><td colspan = "7">' + subs_legal_name + '</td></tr>';
                if (subs_add == null) {
                  template += '<tr><td></td></tr>';
                }
                else {
                  template += '<tr><td colspan = "2"></td><td colspan = "7">' + relaceCharector(subs_add) + '</td></tr>';
                }
                if (subs_ph == null) {
                  template += '<tr><td></td></tr>';
                }
                else {
                  template += '<tr><td colspan = "2"></td><td colspan = "7">Ph <b>:</b>' + subs_ph + '</td></tr>';
                }
                if (subs_fax == null) {
                  template += '<tr><td></td></tr>';
                }
                else {
                  template += '<tr><td colspan = "2"></td><td colspan = "7">Fax <b>:</b>' + subs_fax + '</td></tr>';
                }
                template += '</table>';
      template += '</td></tr>';
      template += '</table>';

      var cl = '';
      if (credit_lim) {
        cl = credit_lim;
      }
      var cd = '';
      if (credit_days) {
        cd = credit_days;
      }
      
      template += '<table style="width:100%;font-size:12px;font-family:verdana,geneva,sans-serif;">';

      template += '<tr><td style="width:53%;"><b>Statement As On &nbsp;</b><b>:</b>&nbsp;' + stat_date + '</td><td align="right;" style="width:47%;"><b>Print Date &nbsp;&nbsp;&nbsp;</b><b>:</b>&nbsp;' + current_date + '</td></tr>';
      template += '<tr><td style="width:53%;"><b>Currency &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b><b>:</b>&nbsp;<b>' + currency_text + '</b></td><td align="right;" style="width:47%;">&nbsp;</td></tr>';
      template += '</table>';
      template += '<table style="width:100%" border="0">';
      template += '<tr><td>&nbsp;</td></tr>';
      template += '</table>';

      var staFilters = [['vendorLine.internalid', 'anyof', vendorID], 'And', ['currency', 'anyof', cur], 'And', ['trandate', 'onorbefore', statement_date], 'And', ['subsidiary', 'anyof', subsidiary]];
      var statementopen = nlapiSearchRecord('transaction', 'customsearch_vendor_statement_open_trans', staFilters);
    
      template += '<table style="width:100%" border="0">';
      template += '<tr><td style="font-size:14px;font-weight:bold;">Outstanding Transactions</td></tr>';
      template += '</table>';
      template += '<table style="width:100%;font-family:verdana,geneva,sans-serif;font-size:8px;">';
      template += '<tr style="font-family:verdana,geneva,sans-serif;font-size:12px;font-weight:bold;">';
      template += '<td align="left" style="padding:4px;border-top:1px solid black;border-bottom:1px solid black;">Date</td>';
      template += '<td align="center" style="padding:4px;width:70px;border-top:1px solid black;border-bottom:1px solid black;">Tran No</td>';
      template += '<td align="center" style="padding:4px;width:70px;border-top:1px solid black;border-bottom:1px solid black;">Ref No</td>';
      template += '<td align="center" style="padding:4px;width:70px;border-top:1px solid black;border-bottom:1px solid black;">P.O No.</td>';
      template += '<td align="center" style="padding:4px;width:70px;border-top:1px solid black;border-bottom:1px solid black;">Overdue Days</td>';
      template += '<td align="center" style="padding:4px;width:40px;border-top:1px solid black;border-bottom:1px solid black;">Tran Amnt</td>';
      template += '<td align="center" style="padding:4px;width:70px;border-top:1px solid black;border-bottom:1px solid black;">&le; 60</td>';
      template += '<td align="center" style="padding:4px;width:70px;border-top:1px solid black;border-bottom:1px solid black;">61-90</td>';
      template += '<td align="center" style="padding:4px;width:70px;border-top:1px solid black;border-bottom:1px solid black;">91-120</td>';
      template += '<td align="center" style="padding:4px;width:70px;border-top:1px solid black;border-bottom:1px solid black;">&ge; 120</td>';
      template += '</tr>';
      var amount_open = 0;
      var amount_appr = 0;
      var amount_pend = 0;
      var amount = 0;
      var total = 0;
      var agingOne = 0;
      var agingOneTotal = 0;
      var agingTwo = 0;
      var agingTwoTotal = 0;
      var agingThree = 0;
      var agingThreeTotal = 0;
      var agingFour = 0;
      var agingFourTotal = 0;
      var trantotal = '';
      var ageingoneAmnt = '';
      var ageingTwoAmnt = '';
      var ageingThreeAmnt = '';
      var ageingFourAmnt = '';
      if (statementopen) {
        for (var st = 0; st < statementopen.length; st++) {
          var clsdate = nlapiStringToDate(statementopen[st].getValue("closedate", null, "min"));
          var stdate = nlapiStringToDate(statement_date);
          var daysOpen = statementopen[st].getValue("daysopen", null, "min");
          var applytrandate = nlapiStringToDate(statementopen[st].getValue("trandate", 'applyingTransaction', "min"));
          var tran_date = nlapiStringToDate(statementopen[st].getValue("trandate", null, "min"));
          var tr_date = tran_date.getDate() + "-" + monthNames[tran_date.getMonth()] + "-" + tran_date.getFullYear();
          var due_date = statementopen[st].getValue("duedate", null, "min");
          var transaction_date = statementopen[st].getValue("trandate", null, "min");
          var vendor_name = statementopen[st].getValue("altname", "vendor", "min");
          if (statementopen[st].getValue("type", null, "min") == 'Bill') {
            if (statementopen[st].getValue("statusref", null, "min") == 'Paid In Full' && stdate < clsdate) {
              if (daysOpen >= 0 && daysOpen <= 60) {
                var amt = 0;
                if (statementopen[st].getValue("fxamountremaining", null, "sum") > 0) {
                  amt = statementopen[st].getValue("fxamountremaining", null, "sum");
                } else { amt = statementopen[st].getValue("payingamount", null, "sum"); }
                ageingoneAmnt = parseFloat(amt);
                agingOneTotal += parseFloat(ageingoneAmnt);
              } else {
                ageingoneAmnt = 0;
              }
              if (daysOpen > 60 && daysOpen <= 90) {
                var amt = 0;
                if (statementopen[st].getValue("fxamountremaining", null, "sum") > 0) {
                  amt = statementopen[st].getValue("fxamountremaining", null, "sum");
                } else { amt = statementopen[st].getValue("payingamount", null, "sum"); }
                ageingTwoAmnt = parseFloat(amt);
                agingTwoTotal += parseFloat(ageingTwoAmnt);
              } else {
                ageingTwoAmnt = 0;
              }
              if (daysOpen > 90 && daysOpen <= 120) {
                var amt = 0;
                if (statementopen[st].getValue("fxamountremaining", null, "sum") > 0) {
                  amt = statementopen[st].getValue("fxamountremaining", null, "sum");
                } else { amt = statementopen[st].getValue("payingamount", null, "sum"); }
                ageingThreeAmnt = parseFloat(amt);
                agingThreeTotal += parseFloat(ageingThreeAmnt);
              } else {
                ageingThreeAmnt = 0;
              }
              if (daysOpen > 120) {
                var amt = 0;
                if (statementopen[st].getValue("fxamountremaining", null, "sum") > 0) {
                  amt = statementopen[st].getValue("fxamountremaining", null, "sum");
                } else { amt = statementopen[st].getValue("payingamount", null, "sum"); }
                ageingFourAmnt = parseFloat(amt);
                agingFourTotal += parseFloat(ageingFourAmnt);
              } else {
                ageingFourAmnt = 0;
              }
              template += '<tr>';
              template += '<td align="left" style="padding:4px;border-bottom:1px solid black;">' + tr_date + '</td>';
              template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("tranid", null, "min") + '</td>';
              template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("transactionnumber", null, "min") + '</td>';
              if (statementopen[st].getValue("createdfrom", null, "min") != "NULL") {
                var refnum = statementopen[st].getValue("createdfrom", null, "min");
                var new_refnum = '';
                if (refnum.indexOf('Purchase Order #') != -1) {
                  new_refnum = strReplace(refnum, 'Purchase Order #');
                  new_refnum = relaceCharector(new_refnum);
                } else {
                  new_refnum = '';
                }
                template += '<td style="font-weight:normal;align:center;border-bottom:1px solid black;">' + new_refnum + '</td>';
              } else { template += '<td style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("daysopen", null, "min") + '</td>';
              if (ageingoneAmnt > 0) {
                template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingoneAmnt.toFixed(2)) + '</td>';
              } else if (ageingTwoAmnt > 0) {
                template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingTwoAmnt.toFixed(2)) + '</td>';
              } else if (ageingThreeAmnt > 0) {
                template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingThreeAmnt.toFixed(2)) + '</td>';
              } else {
                template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingFourAmnt.toFixed(2)) + '</td>';
              }

              if (ageingoneAmnt > 0) {
                template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">' + numberWithCommas(ageingoneAmnt.toFixed(2)) + '</td>';
              } else { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              if (ageingTwoAmnt > 0) { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">' + numberWithCommas(ageingTwoAmnt.toFixed(2)) + '</td>'; }
              else { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              if (ageingThreeAmnt > 0) { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">' + numberWithCommas(ageingThreeAmnt.toFixed(2)) + '</td>'; }
              else { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              if (ageingFourAmnt > 0) { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">' + numberWithCommas(ageingFourAmnt.toFixed(2)) + '</td>'; }
              else { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              template += '</tr>';
              amount += parseFloat(statementopen[st].getValue("payingamount", null, "sum"));
            } else if (statementopen[st].getValue("statusref", null, "min") == 'Open') {
              if (daysOpen >= 0 && daysOpen <= 60) {
                var amt = 0;
                amt = statementopen[st].getValue("fxamountremaining", null, "sum");
                ageingoneAmnt = parseFloat(amt);
                agingOneTotal += parseFloat(ageingoneAmnt);
              } else {
                ageingoneAmnt = 0;
              }
              if (daysOpen > 60 && daysOpen <= 90) {
                var amt = 0;
                amt = statementopen[st].getValue("fxamountremaining", null, "sum");
                ageingTwoAmnt = parseFloat(amt);
                agingTwoTotal += parseFloat(ageingTwoAmnt);
              } else {
                ageingTwoAmnt = 0;
              }
              if (daysOpen > 90 && daysOpen <= 120) {
                var amt = 0;
                amt = statementopen[st].getValue("fxamountremaining", null, "sum");
                ageingThreeAmnt = parseFloat(amt);
                agingThreeTotal += parseFloat(ageingThreeAmnt);
              } else {
                ageingThreeAmnt = 0;
              }
              if (daysOpen > 120) {
                var amt = 0;
                amt = statementopen[st].getValue("fxamountremaining", null, "sum");
                ageingFourAmnt = parseFloat(amt);
                agingFourTotal += parseFloat(ageingFourAmnt);
              } else {
                ageingFourAmnt = 0;
              }
              template += '<tr style="background-color:#ffffff none repeat scroll 0 0;">';
              template += '<td align="left" style="padding:4px;border-bottom:1px solid black;">' + tr_date + '</td>';
              template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("tranid", null, "min") + '</td>';
              template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("transactionnumber", null, "min") + '</td>';
              if (statementopen[st].getValue("createdfrom", null, "min") != "NULL") {
                var refnum = statementopen[st].getValue("createdfrom", null, "min");
                var new_refnum = '';
                if (refnum.indexOf('Purchase Order #') != -1) {
                  new_refnum = strReplace(refnum, 'Purchase Order #');
                  new_refnum = relaceCharector(new_refnum);
                } else {
                  new_refnum = '';
                }
                template += '<td style="font-weight:normal;align:center;border-bottom:1px solid black;">' + new_refnum + '</td>';
              } else { template += '<td style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("daysopen", null, "min") + '</td>';
              if (ageingoneAmnt > 0) {
                template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingoneAmnt.toFixed(2)) + '</td>';
              } else if (ageingTwoAmnt > 0) {
                template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingTwoAmnt.toFixed(2)) + '</td>';
              } else if (ageingThreeAmnt > 0) {
                template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingThreeAmnt.toFixed(2)) + '</td>';
              } else {
                template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingFourAmnt.toFixed(2)) + '</td>';
              }
              if (ageingoneAmnt > 0) {
                template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">' + numberWithCommas(ageingoneAmnt.toFixed(2)) + '</td>';
              } else { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              if (ageingTwoAmnt > 0) { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">' + numberWithCommas(ageingTwoAmnt.toFixed(2)) + '</td>'; }
              else { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              if (ageingThreeAmnt > 0) { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">' + numberWithCommas(ageingThreeAmnt.toFixed(2)) + '</td>'; }

              else { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              if (ageingFourAmnt > 0) { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">' + numberWithCommas(ageingFourAmnt.toFixed(2)) + '</td>'; }
              else { template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
              template += '</tr>';
              amount_open += parseFloat(statementopen[st].getValue("fxamountremaining", null, "sum"));
            }
          } else if (statementopen[st].getValue("type", null, "min") == 'Journal' && statementopen[st].getValue("fxamount", null, "sum") != 0) {
            var amt = 0;
            var days = inDays(stdate, tran_date);
            if (days == 0) {
              amt = statementopen[st].getValue("fxamount", null, "sum");
            }
            else if (statementopen[st].getValue("fxamount", null, "sum") < 0) {
              amt = statementopen[st].getValue("fxamount", null, "sum");
            } else {
              amt = statementopen[st].getValue("fxamountremaining", null, "sum");
            }
            ageingoneAmnt = parseFloat(amt);
            agingOneTotal += parseFloat(ageingoneAmnt);
            template += '<tr style="background-color:#d3d3d3 none repeat scroll 0 0;">';
            template += '<td align="left" style="padding:4px;border-bottom:1px solid black;">' + tr_date + '</td>';
            template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("tranid", null, "min") + '</td>';
            template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("transactionnumber", null, "min") + '</td>';
            if (statementopen[st].getValue("createdfrom", null, "min") != "NULL") {
              var refnum = statementopen[st].getValue("createdfrom", null, "min");
              var new_refnum = '';
              if (refnum.indexOf('Purchase Order #') != -1) {
                new_refnum = strReplace(refnum, 'Purchase Order #');
                new_refnum = relaceCharector(new_refnum);
              } else {
                new_refnum = '';
              }
              template += '<td style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">' + new_refnum + '</td>';
            } else { template += '<td style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
            template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("daysopen", null, "min") + '</td>';
            if (ageingoneAmnt < 0) {
              ageingoneAmnt = ageingoneAmnt * (-1);
              template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">(' + numberWithCommas(ageingoneAmnt.toFixed(2)) + ')</td>';
              template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">(' + numberWithCommas(ageingoneAmnt.toFixed(2)) + ')</td>';
            } else {
              template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingoneAmnt.toFixed(2)) + '</td>';
              template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">' + numberWithCommas(ageingoneAmnt.toFixed(2)) + '</td>';
            }
            template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>';
            template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>';
            template += '<td align="right" style="font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>';
            template += '</tr>';
          } else if (statementopen[st].getValue("type", null, "min") == 'Bill Credit' && statementopen[st].getValue("fxamountremaining", null, "sum") > 0) {

            if (daysOpen >= 0 && daysOpen <= 60) {
              var amt = 0;

              amt = statementopen[st].getValue("fxamountremaining", null, "sum");

              ageingoneAmnt = parseFloat(amt);
              agingOneTotal -= parseFloat(ageingoneAmnt);
            } else {
              ageingoneAmnt = 0;
            }
            if (daysOpen > 60 && daysOpen <= 90) {
              var amt = 0;

              amt = statementopen[st].getValue("fxamountremaining", null, "sum");
              ageingTwoAmnt = parseFloat(amt);
              agingTwoTotal -= parseFloat(ageingTwoAmnt);
            } else {
              ageingTwoAmnt = 0;
            }
            if (daysOpen > 90 && daysOpen <= 120) {
              var amt = 0;

              amt = statementopen[st].getValue("fxamountremaining", null, "sum");
              ageingThreeAmnt = parseFloat(amt);
              agingThreeTotal -= parseFloat(ageingThreeAmnt);
            } else {
              ageingThreeAmnt = 0;
            }
            if (daysOpen > 120) {
              var amt = 0;

              amt = statementopen[st].getValue("fxamountremaining", null, "sum");
              ageingFourAmnt = parseFloat(amt);
              agingFourTotal -= parseFloat(ageingFourAmnt);
            } else {
              ageingFourAmnt = 0;
            }

            template += '<tr style="background-color:#d3d3d3 none repeat scroll 0 0;">';
            template += '<td align="left" style="padding:4px;border-bottom:1px solid black;">' + tr_date + '</td>';
            template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("tranid", null, "min") + '</td>';
            template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("transactionnumber", null, "min") + '</td>';
            if (statementopen[st].getValue("createdfrom", null, "min") != "NULL") {
              var refnum = statementopen[st].getValue("createdfrom", null, "min");
              var new_refnum = '';
              if (refnum.indexOf('Purchase Order #') != -1) {
                new_refnum = strReplace(refnum, 'Purchase Order #');
                new_refnum = relaceCharector(new_refnum);
              } else {
                new_refnum = '';
              }
              template += '<td style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">' + new_refnum + '</td>';
            } else { template += '<td style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
            template += '<td align="center" style="padding:4px;width:70px;border-bottom:1px solid black;">' + statementopen[st].getValue("daysopen", null, "min") + '</td>';
            if (ageingoneAmnt > 0) {
              template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">(' + numberWithCommas(ageingoneAmnt.toFixed(2)) + ')</td>';
            } else if (ageingTwoAmnt > 0) {
              template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">(' + numberWithCommas(ageingTwoAmnt.toFixed(2)) + ')</td>';
            } else if (ageingThreeAmnt > 0) {
              template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">(' + numberWithCommas(ageingThreeAmnt.toFixed(2)) + ')</td>';
            } else {
              template += '<td align="center" style="padding:4px;width:40px;border-bottom:1px solid black;">(' + numberWithCommas(ageingFourAmnt.toFixed(2)) + ')</td>';
            }

            if (ageingoneAmnt > 0) {
              template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">(' + numberWithCommas(ageingoneAmnt.toFixed(2)) + ')</td>';
            } else { template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
            if (ageingTwoAmnt > 0) { template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">(' + numberWithCommas(ageingTwoAmnt.toFixed(2)) + ')</td>'; }
            else { template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
            if (ageingThreeAmnt > 0) { template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">(' + numberWithCommas(ageingThreeAmnt.toFixed(2)) + ')</td>'; }
            else { template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
            if (ageingFourAmnt > 0) { template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">(' + numberWithCommas(ageingFourAmnt.toFixed(2)) + ')</td>'; }
            else { template += '<td align="right" style="font-size:8px;font-weight:normal;align:center;border-bottom:1px solid black;">&nbsp;</td>'; }
            template += '</tr>';
          }
        }
      } else {
        template += '<tr>';
        template += '<td align="center" colspan = "9" style="font-size:10px;font-weight:normal;font-weight:bold;">-None-</td>';
        template += '</tr>';
      }

      template += '<tr>';
      total = parseFloat(amount_pend + amount_appr + amount_open + amount);
      template += '<td colspan="5" style="font-size:10px;font-weight:normal;font-weight:bold;border-bottom:solid 0.2px #e3e3e3;">Total</td>';
      trantotal = parseFloat(agingOneTotal) + parseFloat(agingTwoTotal) + parseFloat(agingThreeTotal) + parseFloat(agingFourTotal);
      if (trantotal < 0) {
        var tran_total = 0;
        tran_total = trantotal * (-1);
        template += '<td align="right" style="font-size:10px;font-weight:normal;font-weight:bold;border-bottom:solid 0.2px #e3e3e3;">(' + numberWithCommas((tran_total).toFixed(2)) + ')</td>';
      } else {
        template += '<td align="right" style="font-size:10px;font-weight:normal;font-weight:bold;border-bottom:solid 0.2px #e3e3e3;">' + numberWithCommas(trantotal.toFixed(2)) + '</td>';
      }
      if (agingOneTotal < 0) {
        var oneTotal = '';
        oneTotal = agingOneTotal * (-1);
        template += '<td align="right" style="font-size:10px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;font-weight:bold;">(' + numberWithCommas(oneTotal.toFixed(2)) + ')</td>';
      } else {
        template += '<td align="right" style="font-size:10px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;font-weight:bold;">' + numberWithCommas(agingOneTotal.toFixed(2)) + '</td>';
      }
      if (agingTwoTotal < 0) {
        var twoTotal = 0;
        twoTotal = agingTwoTotal * (-1);
        template += '<td align="right" style="font-size:10px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;font-weight:bold;">(' + numberWithCommas(twoTotal.toFixed(2)) + ')</td>';
      } else {
        template += '<td align="right" style="font-size:10px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;font-weight:bold;">' + numberWithCommas(agingTwoTotal.toFixed(2)) + '</td>';
      }
      if (agingThreeTotal < 0) {
        var threeTotal = 0;
        threeTotal = agingThreeTotal * (-1);
        template += '<td align="right" style="font-size:10px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;font-weight:bold;">(' + numberWithCommas(threeTotal.toFixed(2)) + ')</td>';
      } else {
        template += '<td align="right" style="font-size:10px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;font-weight:bold;">' + numberWithCommas(agingThreeTotal.toFixed(2)) + '</td>';
      }
      if (agingFourTotal < 0) {
        var fourTotal = 0;
        fourTotal = agingFourTotal * (-1);

        template += '<td align="right" style="font-size:10px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;font-weight:bold;">(' + numberWithCommas(fourTotal.toFixed(2)) + ')</td>';
      } else {
        template += '<td align="right" style="font-size:10px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;font-weight:bold;">' + numberWithCommas(agingFourTotal.toFixed(2)) + '</td>';
      }
      template += '</tr>';
      template += '</table>';
      template += '<table style="width:100%;"><tr><td>&nbsp;</td></tr></table>';

      // Payment SECTION
      var payFilter = [['vendor.internalid', 'anyOf', vendorID], 'And', ['currency', 'anyof', cur], 'And', ['trandate', 'onorbefore', statement_date], 'And', ['subsidiary', 'anyof', subsidiary]];
      var statementPay = nlapiSearchRecord("transaction", "customsearch_vendor_payment_for_statemen", payFilter);
      var totpayAmnt = 0;
      if (statementPay) {
        template += '<table style="width:100%" border="0">';
        template += '<tr><td style="font-size:14px;font-weight:bold;">Bill Payments</td></tr>';
        template += '</table>';
        template += '<table style="width:100%;font-family:verdana,geneva,sans-serif;">';
        template += '<tr style="font-size:12px;">';
        template += '<td style="padding:4px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">PAYMENT #</td>';
        template += '<td style="padding:4px;width:70px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">DATE</td>';
        template += '<td style="padding:4px;width:100px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">CHEQUE NO.</td>';
        template += '<td style="padding:4px;width:100px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">CHEQUE DATE</td>';
        template += '<td style="padding:4px;width:100px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">CHEQUE DRAWN ON</td>';
        template += '<td style="padding:4px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">AMOUNT</td>';
        template += '</tr>';
        for (var payinc = 0; payinc < statementPay.length; payinc++) {

          template += '<tr style="background-color:#ffffff none repeat scroll 0 0;">';
          template += '<td style="font-size:10px;font-weight:normal;">' + statementPay[payinc].getValue("custbody_transactionnumber") + '</td>';
          template += '<td style="font-size:10px;font-weight:normal;">' + statementPay[payinc].getValue("trandate") + '</td>';
          template += '<td style="font-size:10px;font-weight:normal;">' + statementPay[payinc].getValue("tranid") + '</td>';
          template += '<td style="font-size:10px;font-weight:normal;">' + statementPay[payinc].getValue("custbody_chequedate") + '</td>';
          template += '<td style="font-size:10px;font-weight:normal;">' + statementPay[payinc].getValue("custbody_chequebank") + '</td>';
          template += '<td align="right" style="font-size:10px;font-weight:normal;">' + numberWithCommas(statementPay[payinc].getValue("fxamountremaining")) + '</td>';
          template += '</tr>';
          totpayAmnt = totpayAmnt + parseFloat(statementPay[payinc].getValue("fxamountremaining"));
        }
        template += '<tr style="font-size:12px;">';
        template += '<td style="font-size:10px;font-weight:normal;border-top:1px solid black;border-bottom:1px solid black;" colspan="5"><b>Payment Total</b></td><td align="right" style="font-size:10px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">' + numberWithCommas(totpayAmnt.toFixed(2)) + '</td>';
        template += '</tr>';
        template += '</table>';
        template += '<table style="width:100%;"><tr><td>&nbsp;</td></tr></table>';
      }
      var pdcFilter = [['vendor.internalid', 'anyOf', vendorID], 'And', ['currency', 'anyof', cur], 'And', ['custbody_chequedate', 'after', statement_date], 'And', ['subsidiary', 'anyof', subsidiary]];
      var statementpdc = nlapiSearchRecord("transaction", "customsearch_vendor_pdc_statement", pdcFilter);
      var totpdcAmnt = 0;
      if (statementpdc) {
        template += '<table style="width:100%" border="0">';
        template += '<tr><td style="font-size:14px;font-weight:bold;">Post Dated Cheques </td></tr>';
        template += '</table>';
        template += '<table style="width:100%;font-family:verdana,geneva,sans-serif;">';
        template += '<tr style="font-size:12px;">';
        template += '<td style="padding:4px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">PAYMENT #</td>';
        template += '<td style="padding:4px;width:70px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">DATE</td>';
        template += '<td style="padding:4px;width:100px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">CHEQUE NO.</td>';
        template += '<td style="padding:4px;width:100px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">CHEQUE DATE</td>';
        template += '<td style="padding:4px;width:100px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">CHEQUE DRAWN ON</td>';
        template += '<td style="padding:4px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">AMOUNT</td>';
        template += '</tr>';
        for (var pdcinc = 0; pdcinc < statementpdc.length; pdcinc++) {
          var amt = 0;
          if (statementpdc[pdcinc].getValue("amount") != 0) {
            template += '<tr style="background-color:#ffffff none repeat scroll 0 0;">';
            template += '<td style="font-size:10px;font-weight:normal;">' + statementpdc[pdcinc].getValue("transactionnumber") + '</td>';
            template += '<td style="font-size:10px;font-weight:normal;">' + statementpdc[pdcinc].getValue("trandate") + '</td>';
            template += '<td style="font-size:10px;font-weight:normal;">' + statementpdc[pdcinc].getValue("tranid") + '</td>';
            template += '<td style="font-size:10px;font-weight:normal;">' + statementpdc[pdcinc].getValue("custbody_chequedate") + '</td>';
            template += '<td style="font-size:10px;font-weight:normal;">' + statementpdc[pdcinc].getValue("custbody_chequebank") + '</td>';

            amt = parseFloat(statementpdc[pdcinc].getValue("amount"));
            if (amt < 0) {
              amt = amt * (-1);
              template += '<td align="right" style="font-size:10px;font-weight:normal;">(' + numberWithCommas(amt.toFixed(2)) + ')</td>';
            } else {
              template += '<td align="right" style="font-size:10px;font-weight:normal;">' + numberWithCommas(statementpdc[pdcinc].getValue("amount")) + '</td>';
            }
            template += '</tr>';
          }
          totpdcAmnt = totpdcAmnt + parseFloat(statementpdc[pdcinc].getValue("amount"));
        }
        template += '<tr style="font-size:12px;">';
        var totpdc = 0;
        if (totpdcAmnt < 0) {
          totpdc = totpdcAmnt * (-1);
          template += '<td style="font-size:10px;font-weight:normal;border-top:1px solid black;border-bottom:1px solid black;" colspan="5"><b>PDC Total</b></td><td align="right" style="font-size:10px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">(' + numberWithCommas(totpdc.toFixed(2)) + ')</td>';
        } else {
          template += '<td style="font-size:10px;font-weight:normal;border-top:1px solid black;border-bottom:1px solid black;" colspan="5"><b>PDC Total</b></td><td align="right" style="font-size:10px;font-weight:bold;border-top:1px solid black;border-bottom:1px solid black;">' + numberWithCommas(totpdcAmnt.toFixed(2)) + '</td>';
        }

        template += '</tr>';
        template += '</table>';
        template += '<table style="width:100%;"><tr><td>&nbsp;</td></tr></table>';
      }
      template += '<table style="width :100%;">';
      //var total_out = (parseFloat(agingOneTotal)+parseFloat(agingTwoTotal)+parseFloat(agingThreeTotal)+parseFloat(agingFourTotal)-parseFloat(totpayAmnt)+parseFloat(totpdcAmnt));
      template += '<tr><td>&nbsp;</td></tr>';
      var total_debit = 0;
      total_debit = parseFloat(agingOneTotal) + parseFloat(agingTwoTotal) + parseFloat(agingThreeTotal) + parseFloat(agingFourTotal);

      if (total_debit < 0) {
        total_debit = total_debit * (-1);
        template += '<tr><td style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;"><b>Total Payable Amount</b></td><td style="border-bottom:solid 0.2px #e3e3e3;">&nbsp;</td><td align="right" style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;">(' + numberWithCommas((total_debit).toFixed(2)) + ')</td></tr>';
      } else {
        template += '<tr><td style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;"><b>Total Payable Amount</b></td><td style="border-bottom:solid 0.2px #e3e3e3;">&nbsp;</td><td align="right" style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;">' + numberWithCommas((parseFloat(agingOneTotal) + parseFloat(agingTwoTotal) + parseFloat(agingThreeTotal) + parseFloat(agingFourTotal)).toFixed(2)) + '</td></tr>';
      }
      template += '<tr><td style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;"><b>Unadjusted Payment Amount</b></td><td style="border-bottom:solid 0.2px #e3e3e3;">&nbsp;</td><td align="right" style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;">(' + numberWithCommas(parseFloat(totpayAmnt).toFixed(2)) + ')</td></tr>';
      var total_out = 0;
      total_out = parseFloat(agingOneTotal) + parseFloat(agingTwoTotal) + parseFloat(agingThreeTotal) + parseFloat(agingFourTotal) - parseFloat(totpayAmnt) + parseFloat(totpdcAmnt);
      if (total_out < 0) {
        total_out = total_out * (-1);
        template += '<tr><td style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;"><b>Total Outstanding</b></td><td style="border-bottom:solid 0.2px #e3e3e3;">&nbsp;</td><td align="right" style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;">(' + numberWithCommas((total_out).toFixed(2)) + ')</td></tr>';
      } else {
        template += '<tr><td style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;"><b>Total Outstanding</b></td><td style="border-bottom:solid 0.2px #e3e3e3;">&nbsp;</td><td align="right" style="font-size:12px;font-weight:normal;border-bottom:solid 0.2px #e3e3e3;">' + numberWithCommas((parseFloat(agingOneTotal) + parseFloat(agingTwoTotal) + parseFloat(agingThreeTotal) + parseFloat(agingFourTotal) - parseFloat(totpayAmnt) + parseFloat(totpdcAmnt)).toFixed(2)) + '</td></tr>';
      }


      template += '</table>';

      var xml = '<?xml version="1.0"?><!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd" [<!ENTITY nbsp "&#160;">] >'; // start of template
      xml += '<pdf>';
      xml += '<head>';
      //xml += '<style>td p { align:left; }</style>';
    //  xml += '<style>td p { align:left; } body { background-image:url(https://system.eu2.netsuite.com/core/media/media.nl?id=56944&amp;c=4119372&amp;h=81b3d9cd8670550e52ae);}table.header td {padding: 0;font-size: 10pt;}table.footer td {padding: 0;font-size: 9pt;}</style>';
      xml += '<macrolist>';

    xml += '<macro id="myheader">';
    if (subsidiary == '1') {//
      //xml += '<table style="width: 100%;"><tr><td><img src="https://system.eu2.netsuite.com/core/media/media.nl?id=1855&amp;c=4119372&amp;h=b46037635396c70b981c" style="width:657px; height:130px;" /></td></tr></table>';
      xml += '<table class="header" style="width: 100%;margin-left:-45px; margin-right:-65px;margin-top:-46px; "><tr><td><img src="https://system.eu2.netsuite.com/core/media/media.nl?id=26487&amp;c=4647359&amp;h=N7yMHyudqD68aN6yaYCarDgu-nT4u0aoi7g3lKZ708dlEsDK"  style="width:65%;height:60%;"/></td></tr></table>';
    } 

    if (subsidiary == '2') {//
      //xml += '<table style="width: 100%;"><tr><td><img src="https://system.eu2.netsuite.com/core/media/media.nl?id=1855&amp;c=4119372&amp;h=b46037635396c70b981c" style="width:657px; height:130px;" /></td></tr></table>';
      xml += '<table class="header" style="width: 100%;margin-left:-45px; margin-right:-65px;margin-top:-46px; "><tr><td><img src="https://system.eu2.netsuite.com/core/media/media.nl?id=26489&amp;c=4647359&amp;h=8jLOJuWgAnB4EXpAfSKtQfxbGPoNlcPY1buLTrUncQpcjvHG"  style="width:65%;height:60%;"/></td></tr></table>';
    } 
    if (subsidiary == '8') {//
      //xml += '<table style="width: 100%;"><tr><td><img src="https://system.eu2.netsuite.com/core/media/media.nl?id=1855&amp;c=4119372&amp;h=b46037635396c70b981c" style="width:657px; height:130px;" /></td></tr></table>';
      xml += '<table class="header" style="width: 100%;margin-left:-45px; margin-right:-65px;margin-top:-46px; "><tr><td><img src="https://system.eu2.netsuite.com/core/media/media.nl?id=26488&amp;c=4647359&amp;h=6Uxc0nbUkUIpXGHsPLniGwEfM-PfsyucvPJwV0Vhus-USYG_"  style="width:65%;height:60%;"/></td></tr></table>';
    } 
    xml += '</macro>';

      xml += '<macro id="myfooter">';

      xml += '<table class="footer" style="width: 100%;margin-left:-45px; margin-right:-65px;margin-top:100px;font-size:12px;font-weight:normal;">';
      xml += '<tr><td><img src="https://system.eu2.netsuite.com/core/media/media.nl?id=22289&amp;c=4647359&amp;h=RqN0ZlhUyHnIqITW00RkJlkwlhQ3_qQjISqhN5ihvAiMBU_V"  style="width:55%;height:60%;"/></td></tr>';
      // xml += '<tr><td align="left" style="font-size:9px;">*This is a computer generated statement,that requires no signature.</td></tr>';
      //xml += '<tr><td align="left">Vendor Ref# ' + vendorID + '</td><td align="right">( page <pagenumber/> of <totalpages/> ) </td></tr>';
         //  xml += '<tr><td align="center">( page <pagenumber/> of <totalpages/> ) </td></tr>';
      xml += '</table>';
      xml += '</macro>';
      xml += '</macrolist>';
      xml += '</head>';
      xml += '<body style="font-family:sans-serif;background-color:#ffffff;" header="myheader" header-height="14%" footer = "myfooter" footer-height="16%" footer-size="A4">';

      xml += template;
      xml += '</body>';
      xml += '</pdf>';

      // run the BFO library to convert the xml document to a PDF 
      var file = nlapiXMLToPDF(xml);
      // set content type, file name, and content-disposition (inline means display in browser)

      response.setContentType('PDF', 'individualVendorStatement.pdf', 'inline');
      response.write(file.getValue());
    }
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function relaceCharector(charVal) {
      return charVal.replace(/&/g, "&amp;");
    }
    function strReplace(str, replaceVal) {
      var res = str.replace(replaceVal, "");
      return res;
    }
    function inDays(d1, d2) {
      var t2 = d2.getTime();
      var t1 = d1.getTime();
      return parseInt((t2 - t1) / (24 * 3600 * 1000));
    }

  }	