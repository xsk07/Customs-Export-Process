// Version: 11.2.5.1148 
import System; 
import System.Collections; 
import System.Reflection; 
import System.Runtime.InteropServices; 
import System.Data; 
import System.Data.SqlClient; 
import System.Data.OleDb; 
import System.Xml; 
import System.IO; 
import System.Diagnostics; 
import Microsoft.Win32; 

import BizAgi.Defs; 
import BizAgi.Commons; 
import BizAgi.Interop; 
import BizAgi.WFES.Messaging; 
import BizAgi.PAL; 
import BizAgi.EntityManager; 
import BizAgi.Organization; 
import BizAgi.WFES; 
import BizAgi.WFES.Query; 
import BizAgi.Util; 
import BizAgi.UI.Util; 
import BizAgi.ComponentLibrary; 
import BizAgi.SOA.EntityManager; 
import Microsoft.Web.Services2; 
import Microsoft.Web.Services2.Security; 
import Microsoft.Web.Services2.Security.Tokens; 
import BizAgi.Authentication; 
import BizAgi.Rules.DynamicTracer; 

import BizAgi.ComponentLibrary; 
import Bizagi.Diagnostics.Collector; 


			package BizAgi.ComponentLibrary {

			

      public class CRuleContextJS {

      private static var EntityArray;//11.0 EntityArray support. DON'T REMOVE!!

      public static function testMethod(Me:ICAPIWorkItem,BAButtonInfo:CButtonInfo /*PARAMETERS HERE*/) {
      //TEST METHOD HERE
      }

      //MAIN METHODS HERE
      
      public static function evalRuleWithReference(sRule, Me:ICAPIWorkItem) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }

      public static function evalRuleWithReference(sRule, Credential:CCredential) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }

      public static function evalRule(sRule) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }

      public static function processRuleWithReference(sRule, Me:ICAPIWorkItem, RuleContext:BizAgi.PAL.IXPathable) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }      
      public static function processRuleWithReference(sRule, Me:ICAPIWorkItem, RuleContext:BizAgi.PAL.IXPathable, Credential:CCredential) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }
      public static function processRuleWithReference(sRule, Me:ICAPIWorkItem) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }
      public static function processUserFieldCode(sRule, FieldInfo,FieldResponse, Me ) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }
      public static function processUserFieldCode2(sRule, fieldInfo, parameters, Me ) {
      try {
      // Convert json string into a json object
      parameters = eval("var par = " + parameters);
      fieldInfo = eval("var fi = " + fieldInfo);
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }
      public static function processRuleWithReference(sRule, oDataTable) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }


      public static function processRuleWithReference(sRule, Credential:CCredential) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }
      public static function processRuleWithReference(sRule, Credential:CCredential,Me:ICAPIWorkItem) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }
      public static function processButtonRule(sRule, Credential:CCredential, Me:ICAPIWorkItem) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }

      public static function processRule(sRule) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }

      public static function evalRuleWithReference(sRule, EntityArray : BizAgi.PAL.IBaseEntity[]) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      e = CHelper.logError(sRule, e);
      throw e;
      }
      }
      
      public static function evalRuleWithReference(sRule, EntityArray : BizAgi.PAL.IBaseEntity[], Credential:CCredential) {
      try {
      return eval(sRule, "unsafe");

      } catch (e) {
      CHelper.logError(sRule, e);
      throw e;
      }
      }
    

      //COMMON METHODS HERE
      
      private static var internalIsTraceEnabledSet = false;
      private static var internalIsTraceEnabled;
      
      public static function isTraceEnabled() {
		  if (internalIsTraceEnabledSet) return internalIsTraceEnabled;
		  internalIsTraceEnabled =  CHelper.isTraceEnabled();
		  internalIsTraceEnabledSet = true;
      return internalIsTraceEnabled;
      }
      public static function setAttrib(iEntityId:int, oEntityKey, sAttribName, oAttribValue) {
      return CHelper.setAttrib(iEntityId, oEntityKey, sAttribName, oAttribValue);
      }

      public static function getAttrib(iEntityId:int, oEntityKey, sAttribName) {
      return CHelper.getAttrib(iEntityId, oEntityKey, sAttribName);
      }

      public static function IsNull(oValue) {
      return CHelper.IsNull(oValue);
      }

      public static function doWorkItem(iProcId, iTaskId) {
      return CHelper.doWorkItem(iProcId, iTaskId);
      }

      public static function doWorkItemById(iProcId, iWorkItemId) {
      return CHelper.doWorkItemById(iProcId, iWorkItemId);
      }

      public static function doWorkItemById(iProcId, iWorkItemId, arrTransitionIds) {
      return CHelper.doWorkItemById(iProcId, iWorkItemId, arrTransitionIds);
      }

      public static function setAttrib(sEntityName:String, oEntityKey, sAttribName, oAttribValue) {
      return CHelper.setAttrib(sEntityName, oEntityKey, sAttribName, oAttribValue);
      }

      public static function getAttrib(sEntityName:String, oEntityKey, sAttribName) {
      return CHelper.getAttrib(sEntityName, oEntityKey, sAttribName);
      }

      public static function setEvent(oMeOrCredential, iCaseId, oEventNameOrId, htProperties:Hashtable) {
      return CHelper.setEvent(oMeOrCredential, iCaseId, oEventNameOrId, htProperties);
      }

      public static function suspendProcess(Me, iCaseId, eSuspendResumeOptions) {
      return CHelper.suspendProcess(Me, iCaseId, eSuspendResumeOptions);
      }

      public static function resumeProcess(Me, iCaseId, eSuspendResumeOptions) {
      return CHelper.resumeProcess(Me, iCaseId, eSuspendResumeOptions);
      }

      public static function trace(sFileName, sText) {
      return CHelper.trace(sFileName, sText);
      }

      public static function RaiseCancelEndEvent(namedCancelEvent)
      {
      return CHelper.RaiseCancelEndEvent(namedCancelEvent);
      }

      public static function RaiseCancelIntermediateEvent(namedCancelEvent)
      {
      return CHelper.RaiseCancelIntermediateEvent(namedCancelEvent);
      }

      public static function RaiseErrorEndEvent(namedErrorEvent)
      {
      return CHelper.RaiseErrorEndEvent(namedErrorEvent);
      }

      public static function RaiseErrorIntermediateEvent(namedErrorEvent)
      {
      return CHelper.RaiseErrorIntermediateEvent(namedErrorEvent);
      }

      public static function BAIsBlank(oValue)
      {
      if (oValue == DBNull.Value || oValue == null)
      {
      return true;
      }
      else
      {
      try
      {
      if(oValue.toString().length == 0)
      return true;
      }
      catch (e)
      {
      return false;
      }

      return false;
      }
      }

      public static function BAContainsString(sValue, sSearchString) {
      if (sValue == DBNull.Value || sValue == null)
      return false;

      else if (sSearchString == DBNull.Value || sSearchString == null)
      return false;

      else if (sValue.ToString().IndexOf(sSearchString) >= 0)
      return true;

      else
      return false;
      }

      public static function BABeginString(sValue, sSearchString) {
      if (sValue == DBNull.Value || sValue == null)
      return false;

      else if (sSearchString == DBNull.Value || sSearchString == null)
      return false;

      else
      return (sValue.ToString().StartsWith(sSearchString));
      }

      public static function BAYesSelected(bValue) {
      if (bValue == DBNull.Value || bValue == null)
      return false;
      else
      return bValue == 1;
      }

      public static function BANoSelected(bValue) {
      if (bValue == DBNull.Value || bValue == null)
      return false;
      else
      return bValue == 0;
      }
      
      public static function BAIsInvalidEmail(bValue)
      {
      if (bValue == DBNull.Value || bValue == null)
      return false;

      var strMail = bValue;
      if(CHelper.BAIsInvalidEmail(strMail))
      return true;
      else
      return false;

      }


      public static function BANow() {
      return new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
      }

      public static function BADate(year, month, day) {
      return new DateTime(year, month, day, 0, 0, 0);
      }

      public static function BAIsTrue(bValue) {
      if (bValue == DBNull.Value || bValue == null)
      return false;
      else
      return (bValue == 1 || bValue == "True" || bValue == true);
      }
      
      public static function BANullToInt(value) {
        if (value == null)
        {
	        value = 0;
        }
        return value;
      }
      
      public static function BANullToString(value) {
        if (value == null)
        {
	        value = '';
        }
        return value;
      }

      public static function BAIsFalse(bValue) {
      if (bValue == DBNull.Value || bValue == null)
      return false;
      else
      return (bValue == 0 || bValue == "False" || bValue == false);
      }
      
      public static function BAEscapeString(sValue) {
      return CHelper.BAEscapeString(sValue);
      }

      public static function IsAttributeRepeated(oDataTable,sAtrribute){
      var bRepeated = false;
      for (var i = 0; i < oDataTable.Rows.Count; i++){
			if (oDataTable.Rows[i][sAtrribute] != DBNull.Value){
			for (var j = i+1; j < oDataTable.Rows.Count; j++){
			if (oDataTable.Rows[j][sAtrribute] != DBNull.Value){
			if (oDataTable.Rows[i][sAtrribute] == oDataTable.Rows[j][sAtrribute]){
			bRepeated = true;
			break;
			}
			}
			}
			}
			}
			return bRepeated;
			}

		

      //IMPLEM METHODS HERE
      

      }

    

      public class DefaultBizagiFamily extends CRuleContextJS {

      private static var EntityArray;//11.0 EntityArray support. DON'T REMOVE!!

      public static function testMethod(Me:ICAPIWorkItem,BAButtonInfo:CButtonInfo /*PARAMETERS HERE*/) {
      //TEST METHOD HERE
      }

      //MAIN METHODS HERE
      

      //COMMON METHODS HERE
      

      //IMPLEM METHODS HERE
      

      }

    

			}

		