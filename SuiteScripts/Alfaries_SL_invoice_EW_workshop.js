function printInvoiceEWFormatAction(request, response) {
    var recordID = request.getParameter("recordID");
    var invoiceRec = nlapiLoadRecord("invoice", recordID);
    var renderer = nlapiCreateTemplateRenderer();
    var template = "";
    template += '<?xml version="1.0"?>';
    template += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
    template += '<pdf>';
    template += '    <head>';
    template += '        <#if .locale=="ru_RU">';
    template += '            <link name="verdana" type="font" subtype="opentype" src="${nsfont.verdana}" src-bold="${nsfont.verdana_bold}" bytes="2" />';
    template += '        </#if>';
    template += '        <macrolist>';
    // var headerlogo = invoiceRec.getFieldValue("custbody_subsidiary_log");
    // var footerlogotop = invoiceRec.getFieldValue("custbody_subsidiary_top_foot");
    // var footerlogobottom = invoiceRec.getFieldValue("custbody_subsidiary_footer_bottom");
    var subsidiaryId = invoiceRec.getFieldValue("subsidiary");


    template += '            <macro id="nlheader"> ';
    template += '                         <table class="header" style="width: 100%;margin-left:-45px; margin-right:-65px;margin-top:-46px; "><tr>';
    template += '              <td>';
    // if (headerlogo) {
    //     template += "<img class=\"header\" style=\"width:57%;height:40%;margin-left:-47px; margin-right:-65px;margin-top:-48px;\" height=\"40\%\" width=\"57\%\"  src = \"";
    //     var path = "https://7061228.app.netsuite.com" + nlapiLoadFile(headerlogo).getURL();
    //     template += nlapiEscapeXML(path);
    //     template += "\"></img>";
    // }
    var subsidiary = nlapiLoadRecord("subsidiary", subsidiaryId);
    var TRN_NO = subsidiary.getFieldValue("federalidnumber");

    // var TRN_NO = nlapiLookupField("subsidiary", subsidiaryId, "federalidnumber");

    template += '<img src="https://system.eu2.netsuite.com/core/media/media.nl?id=57106&amp;c=4119372&amp;h=556dcae1c908dd746c20" style="width:100%;height:100%;" />';
    template += '</td>';
    template += '  </tr>';
    template += '                          <tr style="position:relative;top:-8px;left:-87px;"><td align="right" style="font-weight:bold;">TRN - ' + TRN_NO + '</td></tr></table>';
    template += '                         <hr style="width: 100%;margin-left:-45px; margin-right:-65px;margin-top:-46px;background-color: #000000;color:#000000"/>';
    template += '              <#if record.subsidiary.custrecord_is_energy?string == \'Yes\'>';
    template += '              <table style="width::100%;font-size:14px;border:solid 1px #ccc;font-size:11px;">';
    template += '               <tr>';
    template += '                  <td style="border-bottom:solid 1px color:#000000;font-weight:bold;font-size:11px;" colspan="2" align="center">TAX INVOICE</td>';
    template += '               </tr>';
    template += '               <tr>';
    template += '                  <td style="width:350px;font-weight:bold;font-size:11px;" align="left">INVOICE NO :  ';
    template += '<#if record.custbody_cust_doc_number?has_content>';
    template += '                   ${record.custbody_cust_doc_number}';
    template += '                   <#else>';
    template += '                     ${record.tranid}';
    template += '                     </#if>';
    template += '                  </td>';
    template += '                  <td style="width:336px;font-weight:bold;font-size:11px;" align="right">INVOICE DATE : ${record.trandate?string[\"d-MMM-yyyy\"]}</td>';
    template += '               </tr>';
    template += '            </table>';
    template += '            <table style="width:100%;margin-top:10px;font-size:11px;">';
    template += '               <tr>';
    template += '                  <td style="border-left:solid 1px #ccc;border-top:solid 1px #ccc;border-bottom:solid 1px #ccc;font-size:11px;">';
    template += '                     <table>';
    template += '                        <tr>';
    template += '                           <#if record.entity.isperson?string == \'T\'> ';
    template += '                           <td><b>${record.entity.altname}</b></td>';
    template += '                           <#else> ';
    template += '                           <td><b>${record.entity.companyname}</b></td>';
    template += '                           </#if>';
    template += '                        </tr>';
    template += '                        <#if record.billaddress?has_content><tr>';
    template += '                           <td>${record.entity.address}</td>';
    template += '                        </tr>';
    template += '                          <#else><tr>';
    template += '                           <td>${record.entity.address}</td>';
    template += '                        </tr>';
    template += '                          </#if>';
    template += '                        <tr>';
    template += '                           <td><b>TRN : </b> ${record.entity.vatregnumber}</td>';
    template += '                        </tr>';
    template += '                        <tr>';
    template += '                           <td><b>Tel #</b> ${record.entity.phone}</td>';
    template += '                        </tr>';
    template += '                        <tr>';
    template += '                           <td><b>Fax #</b> ${record.entity.fax}</td>';
    template += '                        </tr>';
    template += '                          <#if record.custbody_customer_email_id?has_content>';
    template += '                            <tr>';
    template += '                           <td><b>Email</b> ${record.custbody_customer_email_id}</td>';
    template += '                        </tr>';
    template += '                            </#if>';
    template += '                        <tr>';
    template += '                           <td><b>Attn : </b> ${record.custbody_attention}</td>';
    template += '                        </tr>';
    template += '                     </table>';
    template += '                  </td>';
    template += '                  <td style="border-left:solid 1px #ccc;border-top:solid 1px #ccc;border-bottom:solid 1px #ccc;font-size:11px;">';
    template += '                     <table>';
    template += '                       ';
    template += '                        <#if record.subsidiary.custrecord_is_energy?string == \'Yes\'> ';
    template += '                        <tr>';
    template += '                           <td><b>Contract:</b> ${record.custbody_invoice_qt_number_cf}</td>';
    template += '                        </tr>';
    template += '                        <#else> ';
    template += '                        <#if record.custbody_customer_doc_ref_no?has_content>';
    template += '                        <tr>';
    template += '                           <td><b>Contract:</b> ${record.custbody_customer_doc_ref_no}</td>';
    template += '                        </tr>';
    template += '                        <#else>';
    template += '                        <tr>';
    template += '                           <td><b>Contract:</b> ${record.custbody_invoice_qt_number_cf}</td>';
    template += '                        </tr>';
    template += '                        </#if> ';
    template += '                        </#if> ';
    template += '                        <tr>';
    template += '                           <td><b>LPO No:</b> ${record.otherrefnum}</td>';
    template += '                        </tr>';
    template += '                        <tr>';
    template += '                           <td><b>Pay Terms:</b>  ${record.terms}</td>';
    template += '                        </tr>';
    template += '                        <#if record.duedate?string == ""> ';
    template += '                        <tr>';
    template += '                           <td><b>Pay Due:</b> ${record.duedate}</td>';
    template += '                        </tr>';
    template += '                        <#else> ';
    template += '                        <tr>';
    template += '                           <td><b>Pay Due:</b> ${record.duedate?string[\"d-MMM-yyyy\"]}</td>';
    template += '                        </tr>';
    template += '                        </#if> ';
    template += '                        <tr>';
    template += '                           <td><b>Sales Rep:</b> ${record.salesrep.firstname} ${record.salesrep.lastname}</td>';
    template += '                        </tr>';
    template += '                        <tr>';
    template += '                           <td><b>Site:</b> ${record.custbody_site}</td>';
    template += '                        </tr>';
    template += '                     </table>';
    template += '                  </td>';
    template += '                  <td style="border-left:solid 1px #ccc;border-top:solid 1px #ccc;border-bottom:solid 1px #ccc;border-right:solid 1px #ccc;width:258px;font-size:11px;"> ';
    template += '                     <#if record.custbody_bank_details?has_content><span>${record.custbody_bank_details}</span><#else><span>${record.subsidiary.custrecord_bank_address_details}</span></#if> ';
    template += '                     <br/> ';
    template += '                     <b style="font-size:10px;">All bank transfer charges to be borne by customer</b> ';
    template += '                  </td>';
    template += '               </tr>';
    template += '               <tr>';
    template += '                  <td colspan="3" style="border-bottom:solid 1px #ccc;border-left:solid 1px #ccc;border-right:solid 1px #ccc;font-size:11px;"><b>Scope of work : </b> ${record.custbody_scope_of_work}</td>';
    template += '               </tr>';
    template += '            </table>';
    template += '                    <#else>';
    template += '                      <table style="width::100%;font-size:14px;border:solid 1px #ccc;">';
    template += '               <#if record.custbody_is_export_invoice?string == \"Yes\">';
    template += '               <tr>';
    template += '                  <td style="border-bottom:solid 1px color:#000000;font-weight:bold;" colspan="2" align="center">INVOICE</td>';
    template += '               </tr>';
    template += '               <#else>';
    template += '               <tr>';
    template += '                  <td style="border-bottom:solid 1px color:#000000;font-weight:bold;" colspan="2" align="center">TAX INVOICE</td>';
    template += '               </tr>';
    template += '               </#if>';
    template += '               <tr>';
    template += '                  <td style="width:350px;font-weight:bold;" align="left">INVOICE NO : ';
    template += '                   <#if record.custbody_cust_doc_number?has_content>';
    template += '                   ${record.custbody_cust_doc_number}';
    template += '                   <#else>';
    template += '                     ${record.tranid}';
    template += '                     </#if>';
    template += '                </td>';
    template += '                  <td style="width:336px;font-weight:bold;" align="right">INVOICE DATE : ${record.trandate?string[\"d-MMM-yyyy\"]}</td>';
    template += '               </tr>';
    template += '            </table>';
    template += '            <table style="width:100%;margin-top:10px;">';
    template += '               <tr>';
    template += '                  <td style="border-left:solid 1px #ccc;border-top:solid 1px #ccc;border-bottom:solid 1px #ccc;">';
    template += '                     <table>';
    template += '                        <tr>';
    template += '                           <#if record.entity.isperson?string == \'T\'> ';
    template += '                           <td><b>${record.entity.altname}</b></td>';
    template += '                           <#else> ';
    template += '                           <td><b>${record.entity.companyname}</b></td>';
    template += '                           </#if>';
    template += '                        </tr>';
    template += '                        <#if record.billaddress?has_content><tr>';
    template += '                           <td>${record.entity.address}</td>';
    template += '                        </tr>';
    template += '                          <#else><tr>';
    template += '                           <td>${record.entity.address}</td>';
    template += '                        </tr>';
    template += '                          </#if>';
    template += '                        <tr>';
    template += '                           <td><b>TRN : </b> ${record.entity.vatregnumber}</td>';
    template += '                        </tr>';
    template += '                        <tr>';
    template += '                           <td><b>Tel #</b> ${record.entity.phone}</td>';
    template += '                        </tr>';
    template += '                        <tr>';
    template += '                           <td><b>Fax #</b> ${record.entity.fax}</td>';
    template += '                        </tr>';
    template += '                          <#if record.custbody_customer_email_id?has_content>';
    template += '                            <tr>';
    template += '                           <td><b>Email</b> ${record.custbody_customer_email_id}</td>';
    template += '                        </tr>';
    template += '                            </#if>';
    template += '                        <tr>';
    template += '                           <td><b>Attn : </b> ${record.custbody_attention}</td>';
    template += '                        </tr>';
    template += '                     </table>';
    template += '                  </td>';
    template += '                  <td style="border-left:solid 1px #ccc;border-top:solid 1px #ccc;border-bottom:solid 1px #ccc;">';
    template += '                     <table>';
    template += '                       ';
    template += '                        <#if record.subsidiary.custrecord_is_energy?string == \'Yes\'> ';
    template += '                        <tr>';
    template += '                           <td><b>Contract:</b> ${record.custbody_invoice_qt_number_cf}</td>';
    template += '                        </tr>';
    template += '                        <#else> ';
    template += '                        <#if record.custbody_customer_doc_ref_no?has_content>';
    template += '                        <tr>';
    template += '                           <td><b>Contract:</b> ${record.custbody_customer_doc_ref_no}</td>';
    template += '                        </tr>';
    template += '                        <#else>';
    template += '                        <tr>';
    template += '                           <td><b>Contract:</b> ${record.custbody_invoice_qt_number_cf}</td>';
    template += '                        </tr>';
    template += '                        </#if> ';
    template += '                        </#if> ';
    template += '                        <tr>';
    template += '                           <td><b>LPO No:</b> ${record.otherrefnum}</td>';
    template += '                        </tr>';
    template += '                        <tr>';
    template += '                           <td><b>Pay Terms:</b>  ${record.terms}</td>';
    template += '                        </tr>';
    template += '                        <#if record.duedate?string == ""> ';
    template += '                        <tr>';
    template += '                           <td><b>Pay Due:</b> ${record.duedate}</td>';
    template += '                        </tr>';
    template += '                        <#else> ';
    template += '                        <tr>';
    template += '                           <td><b>Pay Due:</b> ${record.duedate?string[\"d-MMM-yyyy\"]}</td>';
    template += '                        </tr>';
    template += '                        </#if> ';
    template += '                        <tr>';
    template += '                           <td><b>Sales Rep:</b> ${record.salesrep.firstname} ${record.salesrep.lastname}</td>';
    template += '                        </tr>';
    template += '                        <tr>';
    template += '                           <td><b>Site:</b> ${record.custbody_site}</td>';
    template += '                        </tr>';
    template += '                     </table>';
    template += '                  </td>';
    template += '                  <td style="border-left:solid 1px #ccc;border-top:solid 1px #ccc;border-bottom:solid 1px #ccc;border-right:solid 1px #ccc;width:258px;"> ';
    template += '                     <#if record.custbody_bank_details?has_content><span>${record.custbody_bank_details}</span><#else><span>${record.subsidiary.custrecord_bank_address_details}</span></#if> ';
    template += '                     <br/> ';
    template += '                     <b style="font-size:10px;">All bank transfer charges to be borne by customer</b> ';
    template += '                  </td>';
    template += '               </tr>';
    template += '               <tr>';
    template += '                  <td colspan="3" style="border-bottom:solid 1px #ccc;border-left:solid 1px #ccc;border-right:solid 1px #ccc;"><b>Scope of work : </b> ${record.custbody_scope_of_work}</td>';
    template += '               </tr>';
    template += '            </table>';
    template += '              </#if>';
    template += '            </macro>';
    template += '            <macro id="nlfooter">';
    template += '              <#if record.subsidiary.internalid?string == \'10\'>';
    template += '                    <table class="footer" style="width: 100%; margin-left:-45px; margin-right:-65px; margin-bottom:-115px;">';
    template += '               <tr>';
    template += '                  <td align="left" style="width:80%;margin-left:15px;">TRN : ${record.custbody_trn}<br/><#if record.custbody_customer_doc_ref_no?has_content>${record.custbody_customer_doc_ref_no} -</#if></td>';
    template += '                  <td align="right" style="margin-top:-20px;">&nbsp;( Page <pagenumber/> of <totalpages/> )</td>';
    template += '               </tr>';
    template += '  <tr>';
    template += '      <td><img src="https://4119372.app.netsuite.com/core/media/media.nl?id=299864&amp;c=4119372&amp;h=RzsiFTaVlSlz0SD3HIkSaRfwXyy4_VJZcey-3Mnm02HUkzGG" style="width:100%;height:100%;"/></td>';
    template += '  </tr></table>  <div style="position:relative;top:-120px;bottom:-80px;left:503px;">';
    template += '   <img src="https://4119372.app.netsuite.com/core/media/media.nl?id=299865&amp;c=4119372&amp;h=2jGJ3_Jsc4MQx5MWkXYshgB5BP8klxMKalqThvsoim4gh3cG" style="width:92%;height:100%;left:13px"/>';
    template += '</div> ';
    template += '<#else>';
    template += '            <table class="footer" style="width: 100%; margin-left:-45px; margin-right:-65px; margin-bottom:-115px;"><tr>';
    template += '  <td align="left" style="width:64%;margin-top:-13px;"><#if record.custbody_customer_doc_ref_no?has_content>${record.custbody_customer_doc_ref_no} -</#if> ${record.subsidiary} / ';
    template += '     <#if record.custbody_cust_doc_number?has_content>';
    template += '                   ${record.custbody_cust_doc_number}';
    template += '                   <#else>';
    template += '                     ${record.tranid}';
    template += '                     </#if>';
    template += '    - <#if record.entity.isperson?string == \'T\'> ${record.entity.altname}<#else>${record.entity.companyname}</#if></td>';
    template += '    <td align="right" style="margin-top:-13px;">&nbsp;( Page <pagenumber/> of <totalpages/> ) -- Rev01-TRPT-07-06-2017 </td>';
    template += '  </tr>';
    template += '  <tr>';
    template += '      <td>';
    // if (footerlogobottom) {
    //     template += "<img class=\"footer\" style=\"width:96%; height:100%;top:95px;margin-left:-50px;\" height=\"100\%\" width=\"96\%\"  src = \"";
    //     var path = "https://7061228.app.netsuite.com" + nlapiLoadFile(footerlogobottom).getURL();
    //     template += nlapiEscapeXML(path);
    //     template += "\"></img>";
    // }
    template += '<img src="https://system.eu2.netsuite.com/core/media/media.nl?id=57109&amp;c=4119372&amp;h=3ee49aaea8b7000504ea" style="width:100%;height:100%;"/>';
    template += '</td>';
    template += '  </tr></table>';
    template += '              <div style="position:relative;top:-108px;bottom:-71px;left:502px;">';
    // if (footerlogotop) {
    //     template += "<img class=\"footer\" style=\"top:-80px;left:510px;margin-right:-40px;width:85%; height:100%;\" height=\"100\%\" width=\"88\%\"  src = \"";
    //     var path = "https://7061228.app.netsuite.com" + nlapiLoadFile(footerlogotop).getURL();
    //     template += nlapiEscapeXML(path);
    //     template += "\"></img>";
    // }
    template += '   <img src="https://4119372.app.netsuite.com/core/media/media.nl?id=174842&amp;c=4119372&amp;h=eed93d9723d115c7c229&amp;fcts=20191001030456&amp;whence=" style="width:35%;height:30%;"/>';
    template += '</div></#if>';
    template += '            </macro>';
    template += '        </macrolist>';
    template += '        <style type="text/css">';
    template += '            span, table {';
    template += '                <#if .locale=="zh_CN">font-family: stsong, sans-serif;';
    template += '                <#elseif .locale=="zh_TW">font-family: msung, sans-serif;';
    template += '                <#elseif .locale=="ja_JP">font-family: heiseimin, sans-serif;';
    template += '                <#elseif .locale=="ko_KR">font-family: hygothic, sans-serif;';
    template += '                <#elseif .locale=="ru_RU">font-family: verdana;';
    template += '                <#else>font-family: sans-serif;';
    template += '                </#if>font-size: 9pt;';
    template += '                table-layout: fixed;';
    template += '            }';
    template += '            th {';
    template += '                font-weight: bold;';
    template += '                font-size: 8.5pt;';
    template += '                vertical-align: middle;';
    template += '                padding: 3px 6px 10px;';
    template += '                /*background-color: #e3e3e3;';
    template += '                color: #333333;*/';
    template += '            }';
    template += '            td {';
    template += '                padding: 4px 6px;';
    template += '            }';
    template += '            b {';
    template += '                font-weight: bold;';
    template += '                color: #333333;';
    template += '            }';
    template += '            table.header td {';
    template += '                padding: 0;';
    template += '                font-size: 10pt;';
    template += '            }';
    template += '            table.footer td {';
    template += '                padding: 0;';
    template += '                font-size: 8pt;';
    template += '            }';
    template += '            table #itemtable th {';
    template += '                padding-bottom: 15px;';
    template += '                padding-top: 2px;';
    template += '                ';
    template += '            }';
    template += '            #itemtable{';
    template += '               font-size: 8.5pt !important;';
    template += '               border: 0.5px solid #000000';
    template += '            }';
    template += '            table.body td {';
    template += '                padding-top: 2px;';
    template += '            }';
    template += '            table.total {';
    template += '                page-break-inside: avoid;';
    template += '            }';
    template += '            tr.totalrow {';
    template += '                background-color: #e3e3e3;';
    template += '                line-height: 200%;';
    template += '            }';
    template += '            td.totalboxtop {';
    template += '                font-size: 12pt;';
    template += '                background-color: #e3e3e3;';
    template += '            }';
    template += '            td.addressheader {';
    template += '                font-size: 8pt;';
    template += '                padding-top: 6px;';
    template += '                padding-bottom: 2px;';
    template += '            }';
    template += '            td.address {';
    template += '                padding-top: 0;';
    template += '            }';
    template += '            td.totalboxmid {';
    template += '                font-size: 28pt;';
    template += '                padding-top: 20px;';
    template += '                background-color: #e3e3e3;';
    template += '            }';
    template += '            td.totalboxbot {';
    template += '                background-color: #e3e3e3;';
    template += '                font-weight: bold;';
    template += '            }';
    template += '            span.title {';
    template += '                font-size: 28pt;';
    template += '            }';
    template += '            span.number {';
    template += '                font-size: 16pt;';
    template += '                text-align:center;';
    template += '            }';
    template += '            span.itemname {';
    template += '                font-weight: bold;';
    template += '                line-height: 150%;';
    template += '            }';
    template += '            hr {';
    template += '                width: 100%;';
    template += '                color: #d3d3d3;';
    template += '                background-color: #d3d3d3;';
    template += '                height: 1px;';
    template += '            }';
    template += '            table.nospacing tr td {';
    template += '                padding: 0px;';
    template += '            }';
    template += '            table.smalltext tr td {';
    template += '                font-size: 8pt;';
    template += '            }';
    template += '            /*table.itemtable th{';
    template += '                border-bottom: 10px #ffc966;';
    template += '                border-color: yellow;';
    template += '            }*/';
    template += '            p.alignR {';
    template += '                text-align: right !important;';
    template += '            }';
    template += '            p.alignL {';
    template += '                text-align: left !important;';
    template += '            }';
    template += '            p.alignC {';
    template += '                text-align: center !important;';
    template += '            }';
    template += '            table.lnhght td{';
    template += '                line-height:16;';
    template += '            }';
    template += '            .td_right_line{';
    template += '      /*border-right: 0.5px solid #f4f4f4;*/';
    template += '             border-right :0.5px solid #000000;            ';
    template += '      }';
    template += '      .td_bottom_line{';
    template += '      border-bottom: 0.5px solid #000000;';
    template += '      }';
    template += '      .td_top_line{';
    template += '            /*border-top :0.5px solid #f4f4f4;*/';
    template += '       border-top :0.5px solid #000000;';
    template += '      }';
    template += '            .title{';
    template += '            font-weight: bold;';
    template += '            align:center!important;';
    template += '            font-size:16pt;';
    template += '            line-height: 150%;';
    template += '            }';
    template += '        </style>';
    template += '    </head>';
    template += '   ';
    template += '  <body style="font-family:sans-serif;background-color:#ffffff;" header="nlheader" footer-height="6%" header-height="40%" footer="nlfooter" background-image-width="8.5in" background-image-position="bottom center" background-image-height="4in"   size="Letter" >';
    template += '        <#if record.item?has_content>';
    template += '            <table id="itemtable" style="width: 100%; margin-top: 10px;">';
    template += '                <#assign SrNo=0>';
    template += '                <#assign qty_to_ord = 0 >';
    template += '                <#list record.item as item>';
    template += '                    <#if item_index==0>';
    template += '                        <thead>';
    template += '                            <tr>';
    template += '                              <th class="td_right_line" width="3%" align="center" colspan="1">Sl</th>';
    template += '                                <th class="td_right_line" width="33%" colspan="7"><p class="alignL">Description</p></th>';
    template += '                                <th class="td_right_line" width="05%" colspan="2"><p class="alignL">Qty</p></th>';
    template += '                           <#if record.custbody_record_type?string == \'Work Request ED Project\'> ';
    template += '                                <th class="td_right_line" width="7%" colspan="2"><p class="alignL">UOM</p></th>';
    template += '                           </#if>';
    template += '                                <th class="td_right_line" width="08%" colspan="3" align="right"><p class="alignL">Rate</p></th>';
    template += '                                <th class="td_right_line" width="10%" colspan="3" align="right"><p>Amount</p></th>';
    template += '                                <th class="td_right_line" width="5%" colspan="3" align="right"><p>VAT</p></th>';
    template += '                                <th width="10%" colspan="3" align="right"><p>Gross Amt</p></th>';
    template += '                            </tr>';
    template += '                        </thead>';
    template += '                    </#if>';
    template += '                    <#if item.item != "Default Component">';
    template += '                        <tr>';
    template += '                            <td  class="td_top_line td_right_line" colspan="1" line-height="150%"><#assign SrNo=SrNo + 1/> ${SrNo}</td>';
    template += '                         ';
    template += '                            <td  class="td_top_line td_right_line" colspan="7">';
    template += '                                <p class="alignL">${item.description}</p>';
    template += '                            </td>';
    template += '                            <td class="td_top_line td_right_line" colspan="2">';
    template += '                                <p class="alignL">${item.quantity}</p>';
    template += '                            </td>';
    template += '                           <#if record.custbody_record_type?string == \'Work Request ED Project\'> ';
    template += '                            <td  class="td_top_line td_right_line" colspan="2">';
    template += '                              <p class="alignL">${item.units}</p>';
    template += '                          </td>';
    template += '                           </#if>';
    template += '                          <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                              <p class="alignL">${item.rate?string[\"##,##0.00\"]}</p>';
    template += '                          </td>';
    template += '                          <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                              <p class="alignR">${item.amount?string[\"##,##0.00\"]}</p>';
    template += '                          </td>';
    template += '                            <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                                <p class="alignR">${item.tax1amt?string[\"##,##0.00\"]}</p>';
    template += '                            </td>';
    template += '                            <td class="td_top_line" colspan="3" align="right">';
    template += '                                <p class="alignR">${item.grossamt?string[\"##,##0.00\"]}</p>';
    template += '                            </td>';
    template += '                        </tr>';
    template += '                        </#if>';
    template += '                  <#if record.currencysymbol?string != \"AED\">';
    template += '           <#assign amtexclTaxaed = item.amount * record.exchangerate />';
    template += '           <#assign taxaxaed = item.tax1amt * record.exchangerate />';
    template += '           <#assign grossamtAED = item.grossamt * record.exchangerate />';
    template += '         <tr>';
    template += '                            <td  class="td_top_line td_right_line" colspan="1" line-height="150%">&nbsp;</td>';
    template += '                            <td  class="td_top_line td_right_line" colspan="7">';
    template += '                                <p class="alignL"><b>Values in AED</b></p>';
    template += '                            </td>';
    template += '                            <td class="td_top_line td_right_line" colspan="2">';
    template += '                                <p class="alignL">&nbsp;</p>';
    template += '                            </td>';
    template += '                            <td  class="td_top_line td_right_line" colspan="2">';
    template += '                              <p class="alignL">&nbsp;</p>';
    template += '                          </td>';
    template += '                          <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                              <p class="alignL">&nbsp;</p>';
    template += '                          </td>';
    template += '                          <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                              <p class="alignR">${amtexclTaxaed?string[\"##,##0.00\"]}</p>';
    template += '                          </td>';
    template += '                            <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                                <p class="alignR">${taxaxaed?string[\"##,##0.00\"]}</p>';
    template += '                            </td>';
    template += '                            <td class="td_top_line" colspan="3" align="right">';
    template += '                                <p class="alignR">${grossamtAED?string[\"##,##0.00\"]}</p>';
    template += '                            </td>';
    template += '                        </tr>';
    template += '         </#if>';
    template += '                </#list>';
    template += '                <tr>';
    template += '                           <#if record.custbody_record_type?string == \'Work Request ED Project\'> ';
    template += '              <td  class="td_top_line td_right_line" colspan="12" line-height="150%"><b>${record.currency} ${record.custbody_amount_into_words?capitalize}</b></td>';
    template += '                   <#else>';
    template += '              <td  class="td_top_line td_right_line" colspan="10" line-height="143%"><b>${record.currency} ${record.custbody_amount_into_words?capitalize}</b></td>';
    template += '         </#if>';

    template += '                          <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                              <p class="alignR"><b>Total</b></p>';
    template += '                          </td>';
    template += '                          <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                              <p class="alignR"><b>${record.subtotal?string[\"##,##0.00\"]}</b></p>';
    template += '                          </td>';
    template += '                            <td  class="td_top_line td_right_line" colspan="3" align="right">';
    template += '                                <p class="alignR"><b>${record.taxtotal?string[\"##,##0.00\"]}</b></p>';
    template += '                            </td>';
    template += '                            <td  class="td_top_line" colspan="3" align="right">';
    template += '                                <p class="alignR"><b>${record.total?string[\"##,##0.00\"]}</b></p>';
    template += '                            </td>';
    template += '                </tr>';
    template += '             </table>';
    template += '                  <#if record.currencysymbol?string != \"AED\">';
    template += '      <table style="width:50%;border:1px solid black;font-weight:bold;margin-top:5 px;font-size:11px;">';
    template += '         <tr>';
    template += '            <td>Total Value in AED : ${(record.total * record.exchangerate)?string[\"#,##0.00\"]}</td>';
    template += '         </tr>';
    template += '         <tr>';
    template += '            <td>Tax in AED : ${(record.taxtotal * record.exchangerate)?string[\"#,##0.00\"]}</td>';
    template += '         </tr>';
    template += '        <#if record.currencysymbol?string != \"AED\">';
    template += '        <tr>';
    template += '            <td>Exchange Rate : (${record.currencysymbol} - AED) = ${record.exchangerate?string[\"0.######\"]}</td>';
    template += '         </tr>';
    template += '          </#if>';
    template += '         <tr>';
    template += '            <td>VALUES IN AED FOR VAT PURPOSES ONLY.</td>';
    template += '         </tr>';
    template += '      </table>';
    template += '      </#if>';
    template += '                <table width="100%" style="border:0px solid #f4f4f4;padding-top:10px;margin-top: 15px;">';
    template += '                    <tr><td align="left" colspan="26" style="padding-top:5px;font-size: 8.5pt;"><b>Remarks</b><br/>${record.custbody_sa_remarks}<br/><br/></td></tr>';
    template += '                <tr >';
    template += '                  <td style="padding-top:5px;font-size: 8.5pt;" colspan="8" align="left"><p class="alignC">Prepared By </p><br/><br/></td>';
    template += '          <td style="padding-top:5px;font-size: 8.5pt;" colspan="10" align="center"><p class="alignC">Received By </p><br/><br/></td>';
    template += '          <td style="padding-top:5px;font-size: 8.5pt;" colspan="8" align="center"><p class="alignC">Authorised By </p><br/><br/></td>';
    template += '                </tr>';
    template += '            </table>';
    template += '        </#if>';
    template += '    </body>';
    template += '</pdf>';
    renderer.setTemplate(template);
    renderer.addRecord('record', invoiceRec);
    var xml = renderer.renderToString();
    var file = nlapiXMLToPDF(xml);
    response.setContentType('PDF', 'Invoice' + invoiceRec.getFieldValue('id') + '.pdf', 'inline');
    response.write(file.getValue());
}