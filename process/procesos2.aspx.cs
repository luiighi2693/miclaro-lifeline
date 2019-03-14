using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.IO;
using Newtonsoft.Json.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Configuration;
using System.Net.Http;
//using System.Net.Http.Headers;
using System.Net;


public partial class proccess_procesos2 : System.Web.UI.Page
{

    // intarcia Serializado
    System.Web.Script.Serialization.JavaScriptSerializer json = new System.Web.Script.Serialization.JavaScriptSerializer();
    
    string wspathNet = "";
    string wspathNetV3 = "";
    string wspathNetPrepaid = "";
    string wspathNetLogin = "";
    string wspathNetReferido = "http://mcloginws.claroinfo.com/api/";
    string wspathNetApiKey = "efbe75c7-472e-4718-ab98-46191bfc3150";
    string wspathNetApiKey2 = "6af3982a-ce65-41a0-93d9-52bd172685cd";
    string wspathNet2 = "https://wsclarorprodnew.claropr.com/api-miclaro-services-prod-new/miclaro/";

    //string wspathUSF = "http://wslifeusf.claropr.com/";
    string wspathUSF = "http://wslife00042ws.claroinfo.com";

    private const string AntiXsrfTokenKey = "__AntiXsrfToken";
    private const string AntiXsrfUserNameKey = "__AntiXsrfUserName";
    private string _antiXsrfTokenValue;

    protected void Page_Init(object sender, EventArgs e)
    {

	
        // The code below helps to protect against XSRF attacks
        var requestCookie = Request.Cookies[AntiXsrfTokenKey];
        Guid requestCookieGuidValue;
        if (requestCookie != null && Guid.TryParse(requestCookie.Value, out requestCookieGuidValue))
        {
            // Use the Anti-XSRF token from the cookie
            _antiXsrfTokenValue = requestCookie.Value;
            Page.ViewStateUserKey = _antiXsrfTokenValue;
        }
        else
        {
            // Generate a new Anti-XSRF token and save to the cookie
            _antiXsrfTokenValue = Guid.NewGuid().ToString("N");
            Page.ViewStateUserKey = _antiXsrfTokenValue;

            var responseCookie = new HttpCookie(AntiXsrfTokenKey)
            {
                HttpOnly = true,
                Value = _antiXsrfTokenValue
            };
            if (Request.IsSecureConnection)
            {
                responseCookie.Secure = true;
            }
            Response.Cookies.Set(responseCookie);
        }

    }

    protected void Page_Load(object sender, EventArgs e)
    {

        if (!IsPostBack)
        {
            // Set Anti-XSRF token
            ViewState[AntiXsrfTokenKey] = Page.ViewStateUserKey;
            ViewState[AntiXsrfUserNameKey] = Context.User.Identity.Name ?? String.Empty;
        }
        else
        {
            // Validate the Anti-XSRF token
            if ((string)ViewState[AntiXsrfTokenKey] != _antiXsrfTokenValue
                || (string)ViewState[AntiXsrfUserNameKey] != (Context.User.Identity.Name ?? String.Empty))
            {
                throw new InvalidOperationException("Validation of Anti-XSRF token failed.");
            }
        }

         
        // load paths
        wspathNet = ConfigurationManager.AppSettings["wspathNet"];
		wspathNetV3 = ConfigurationManager.AppSettings["wspathNetV3"];
        wspathNetPrepaid = ConfigurationManager.AppSettings["wspathNetPrepaid"];
        wspathNetLogin = ConfigurationManager.AppSettings["wspathNetLogin"];

        wspathUSF = ConfigurationManager.AppSettings["wspathUSF"];


        // carga de datos Post.
        System.IO.StreamReader sr = new System.IO.StreamReader(Request.InputStream);
        string line = sr.ReadToEnd();

        if (line == "")
        {
            Response.Redirect("../error_404.html");
        }

        // Parseo de datos.
        JObject jo = JObject.Parse(line);



        string ejecutar = (string)jo["method"];


        if (ejecutar == "getBan")
        {
            getBan(jo);
        }
        else if (ejecutar == "authenticate")
        {
            authMixed(jo);
        }
        else if (ejecutar == "getAuthByToken")
        {
            getAuthByToken(jo);
        }
        else if (ejecutar == "autenticar")
        {
            autenticar(jo);
        }
        else if (ejecutar == "validatePrepaid")
        {
            validatePrepaid(jo);
        }
        else if (ejecutar == "BAN")
        {
            BAN(jo);
        }
        else if (ejecutar == "GetGift1GBSend")
        {
            GetGift1GBSend(jo);
        }
        else if (ejecutar == "DoPayment")
        {
            DoPayment(jo);
        }
        else if (ejecutar == "AuthByToken")
        {
            AuthByToken(jo);
        }
        else if (ejecutar == "SessionIsAlive")
        {
            SessionIsAlive(jo);
        }
        else if (ejecutar == "GetHistoricoFacturas")
        {
            GetHistoricoFacturas(jo);
        }
        else if (ejecutar == "PaymentHistory")
        {
            PaymentHistory(jo);
        }
        else if (ejecutar == "GetHistoricoRechazos")
        {
            GetHistoricoRechazos(jo);
        }
        else if (ejecutar == "GetSubscriber")
        {
            GetSubscriber(jo);
        }
        else if (ejecutar == "GetPersonalData")
        {
            GetPersonalData(jo);
        }
        else if (ejecutar == "GetPersonalAlerts")
        {
            GetPersonalAlerts(jo);
        }
        else if (ejecutar == "GetPersonalAlertsAndNTCStatus")
        {
            GetPersonalAlertsAndNTCStatus(jo);
        }
        else if (ejecutar == "UpdatePin")
        {
            UpdatePin(jo);
        }
        else if (ejecutar == "GetSVA")
        {
            GetSVA(jo);
        }
        else if (ejecutar == "GetOrders")
        {
            GetOrders(jo);
        }
        else if (ejecutar == "GetProyectionImage")
        {
            GetProyectionImage(jo);
        }
        else if (ejecutar == "changePassword")
        {
            changePassword(jo);
        }
        else if (ejecutar == "changePassword2")
        {
            changePassword2(jo);
        }
        else if (ejecutar == "UpdateAlerts")
        {
            UpdateAlerts(jo);
        }
        else if (ejecutar == "AddGift1GB")
        {
            AddGift1GB(jo);
        }
        else if (ejecutar == "ClosePaymentATH")
        {
            ClosePaymentATH(jo);
        }
        else if (ejecutar == "Reconnect2")
        {
            Reconnect2(jo);
        }
        else if (ejecutar == "GetPlanInfo")
        {
            GetPlanInfo(jo);
        }
        else if (ejecutar == "makePayment")
        {
            makePayment(jo);
        }
        else if (ejecutar == "makePaymentATH")
        {
            makePaymentATH(jo);
        }
        else if (ejecutar == "getUserAccount")
        {
            getUserAccount(jo);
        }
        else if (ejecutar == "updateEmailAndPassword")
        {
            updateEmailAndPassword(jo);
        }
        else if (ejecutar == "updatePassword")
        {
            updatePassword(jo);
        }
        else if (ejecutar == "GetActiveOfferPlans")
        {
            GetActiveOfferPlans(jo);
        }
        else if (ejecutar == "getAccounts")
        {
            getAccounts(jo);
        }
        else if (ejecutar == "addAccounts")
        {
            addAccounts(jo);
        }
        else if (ejecutar == "deleteAccount")
        {
            deleteAccount(jo);
        }
        else if (ejecutar == "Reconnect")
        {
            Reconnect(jo);
        }
        else if (ejecutar == "SetSubscriberGroupLimit")
        {
            SetSubscriberGroupLimit(jo);
        }
        else if (ejecutar == "GetLimitUpdate")
        {
            GetLimitUpdate(jo);
        }
        else if (ejecutar == "updateSubscriberPricePlanSocsNextCicle")
        {
            updateSubscriberPricePlanSocsNextCicle(jo);
        }
        else if (ejecutar == "updateSubscriberPricePlanSocs")
        {
            updateSubscriberPricePlanSocs(jo);
        }
        else if (ejecutar == "SetLimitUpdate")
        {
            SetLimitUpdate(jo);
        }
        else if (ejecutar == "UpdateGroup")
        {
            UpdateGroup(jo);
        }
        else if (ejecutar == "SetMasterReservation")
        {
            SetMasterReservation(jo);
        }
        else if (ejecutar == "DSLCatalog")
        {
            DSLCatalog(jo);
        }
        else if (ejecutar == "adaDslPackageChange")
        {
            adaDslPackageChange(jo);
        }
        else if (ejecutar == "getPlanes")
        {
            getPlanes(jo);
        }
        else if (ejecutar == "getPlanes2")
        {
            getPlanes2(jo);
        }
        else if (ejecutar == "UpdateBasicRegister")
        {
            UpdateBasicRegister(jo);
        }
        else if (ejecutar == "AddOffersToGroup")
        {
            AddOffersToGroup(jo);
        }
        else if (ejecutar == "GetOffersToSubscriber")
        {
            GetOffersToSubscriber(jo);
        }
        else if (ejecutar == "ValidateCreditLimit")
        {
            ValidateCreditLimit(jo);
        }
        else if (ejecutar == "AddOffersToSubscriber")
        {
            AddOffersToSubscriber(jo);
        }
        else if (ejecutar == "GetOffersToSubscriberFromOfferGroup")
        {
            GetOffersToSubscriberFromOfferGroup(jo);
        }
        else if (ejecutar == "GetOffersFromOfferGroup")
        {
            GetOffersFromOfferGroup(jo);
        }
        else if (ejecutar == "GetReadGroup")
        {
            GetReadGroup(jo);
        }
        else if (ejecutar == "GetReadSubscriber")
        {
            GetReadSubscriber(jo);
        }
        else if (ejecutar == "NotToCall")
        {
            NotToCall(jo);
        }
        else if (ejecutar == "GetNotToCallStatus")
        {
            GetNotToCallStatus(jo);
        }
        else if (ejecutar == "UpdatePersonalData")
        {
            UpdatePersonalData(jo);
        }
        else if (ejecutar == "UpdatePersonalDir")
        {
            UpdatePersonalDir(jo);
        }
        else if (ejecutar == "changeAccount")
        {
            changeAccount(jo);
        }
        else if (ejecutar == "GetGift1GBByGUI")
        {
            GetGift1GBByGUI(jo);
        }
        else if (ejecutar == "getFailure")
        {
            getFailure(jo);
        }
        else if (ejecutar == "getStatusGuarantee")
        {
            getStatusGuarantee(jo);
        }
        else if (ejecutar == "sendFailure")
        {
            sendFailure(jo);
        }
        else if (ejecutar == "getSVAList")
        {
            getSVAList(jo);
        }
        else if (ejecutar == "buySVA")
        {
            buySVA(jo);
        }
        else if (ejecutar == "pay")
        {
            pay(jo);
        }
        else if (ejecutar == "getDirectDebitInfo")
        {
            getDirectDebitInfo(jo);
        }
        else if (ejecutar == "getDirectDebitInfo2")
        {
            getDirectDebitInfo2(jo);
        }
        else if (ejecutar == "updateDirectDebit")
        {
            updateDirectDebit(jo);
        }
		else if (ejecutar == "getKey")
        {
            getKey(jo);
        }
        else if (ejecutar == "accountPackagesInfo")
        {
            accountPackagesInfo(jo);
        }
        else if (ejecutar == "subscriptionAutomaticRenewalAdd")
        {
            subscriptionAutomaticRenewalAdd(jo);
        }
        else if (ejecutar == "subscriptionAutomaticRenewalRemove")
        {
            subscriptionAutomaticRenewalRemove(jo);
        }
        else if (ejecutar == "getCreditsByAccount")
        {
            getCreditsByAccount(jo);
        }
        else if (ejecutar == "getaccountdetails")
        {
            getaccountdetails(jo);
        }
        else if (ejecutar == "updateBillParameters")
        {
            updateBillParameters(jo);
        }
        else if (ejecutar == "getaccess")
        {
            getaccess(jo);
        }
        else if (ejecutar == "loginAdMcapi")
        {
            loginAdMcapi(jo);
        }
        else if (ejecutar == "validareSSNAdMcapi")
        {
            validareSSNAdMcapi(jo);
        }
        else
        {
            // Response.Redirect("../error_404.html");
        }
        

    }

    public void loginAdMcapi(JObject jo)
    {
        string userName = jo["userName"].ToString();
        string Password = jo["Password"].ToString();
        string PostData = "{\"userName\":\"" + userName + "\",\"Password\":\"" + Password + "\"}";

        //string PostURL =wspathNet+"AccountPackagesInfo";
        string PostURL = "http://wslife00042ws.claroinfo.com/Service/svc/1/LOGINAD.MCAPI";
        //object resp = ToJson(PostWebServiceBearrer(PostURL, PostData, token));
        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void validareSSNAdMcapi(JObject jo)
    {
        string USER_ID = jo["USER_ID"].ToString();
        string CUSTOMER_NAME = jo["CUSTOMER_NAME"].ToString();
        string CUSTOMER_MN = jo["CUSTOMER_MN"].ToString();
        string CUSTOMER_LAST = jo["CUSTOMER_LAST"].ToString();
        string CUSTOMER_SSN = jo["CUSTOMER_SSN"].ToString();
        string CUSTOMER_DOB = jo["CUSTOMER_DOB"].ToString();
        string GENDER = jo["GENDER"].ToString();
        string CUSTOMER_ID_TYPE = jo["CUSTOMER_ID_TYPE"].ToString();
        string ID_NUMBER = jo["ID_NUMBER"].ToString();
        string DTS_EXP = jo["DTS_EXP"].ToString();
        string DEP_APPLICATION = jo["DEP_APPLICATION"].ToString();
        string PHONE_1 = jo["PHONE_1"].ToString();
        string COMUNICATION = jo["COMUNICATION"].ToString();
        string Home = jo["Home"].ToString();
        string PostData = "{\"USER_ID\":\"" + USER_ID + "\",\"CUSTOMER_NAME\":\"" + CUSTOMER_NAME + "\",\"CUSTOMER_MN\":\"" + CUSTOMER_MN + "\",\"CUSTOMER_LAST\":\"" + CUSTOMER_LAST + "\",\"CUSTOMER_SSN\":\"" + CUSTOMER_SSN + "\",\"CUSTOMER_DOB\":\"" + CUSTOMER_DOB + "\",\"GENDER\":\"" + GENDER + "\",\"CUSTOMER_ID_TYPE\":\"" + CUSTOMER_ID_TYPE + "\",\"ID_NUMBER\":\"" + ID_NUMBER + "\",\"DTS_EXP\":\"" + DTS_EXP + "\",\"DEP_APPLICATION\":\"" + DEP_APPLICATION + "\",\"PHONE_1\":\"" + PHONE_1 + "\",\"COMUNICATION\":\"" + COMUNICATION + "\",\"Home\":\"" + Home + "\"}";

        //string PostURL =wspathNet+"AccountPackagesInfo";
        string PostURL = "http://wslife00042ws.claroinfo.com/Service/svc/1/VALIDATE_SSN.MCAPI";
        //object resp = ToJson(PostWebServiceBearrer(PostURL, PostData, token));
        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void subscriptionAutomaticRenewalRemove(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string SubscriberId = jo["SubscriberId"].ToString();
        string OfferID = jo["OfferID"].ToString();
        string BaseOfferId = jo["BaseOfferId"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"SubscriberId\":\"" + SubscriberId + "\",\"OfferID\":\"" + OfferID + "\",\"BaseOfferId\":\"" + BaseOfferId + "\"}";

        string PostURL = wspathNetV3+"SubscriptionAutomaticRenewalRemove";
        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public void subscriptionAutomaticRenewalAdd(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string SubscriberId = jo["SubscriberId"].ToString();
        string OfferID = jo["OfferID"].ToString();
        string BaseOfferId = jo["BaseOfferId"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"SubscriberId\":\"" + SubscriberId + "\",\"OfferID\":\"" + OfferID + "\",\"BaseOfferId\":\"" + BaseOfferId + "\"}";

        string PostURL = wspathNetV3+"SubscriptionAutomaticRenewal";
        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
  
    public void accountPackagesInfo(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string Ban = jo["Ban"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"Ban\":\"" + Ban + "\"}";

        //string PostURL =wspathNet+"AccountPackagesInfo";
        string PostURL = "http://wsv3qa.clarotodo.com/Service/v3/AccountPackagesInfo";
        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void getCreditsByAccount(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string Account = jo["Account"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"Account\":\"" + Account + "\"}";

        //string PostURL =wspathNet+"AccountPackagesInfo";
        string PostURL = wspathNetReferido+"referr/getCreditsByAccount";
        object resp = ToJson(PostWebServiceBearrer(PostURL, PostData,token));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public void getaccess(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string subscriber = jo["subscriber"].ToString();
        string account = jo["account"].ToString();
        string PostData = "{\"account\":\"" + account + "\",\"subscriber\":\"" + subscriber + "\"}";

        //string PostURL =wspathNet+"AccountPackagesInfo";
        string PostURL = "http://mcloginws.claroinfo.com/api/customers/getaccess";
        object resp = ToJson(PostWebServiceBearrer(PostURL, PostData, token));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void getaccountdetails(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string account = jo["account"].ToString();
        string subscriber = jo["subscriber"].ToString();
        string PostData = "{\"account\":\"" + account + "\",\"subscriber\":\"" + subscriber + "\"}";

        //string PostURL =wspathNet+"AccountPackagesInfo";
        string PostURL = wspathNetReferido + "customers/getaccountdetails";
        object resp = ToJson(PostWebServiceBearrer(PostURL, PostData, token));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

   public void getKey(JObject jo)
    {
		string token = Base64Encode(Session["token"].ToString());
		object resp = ToJson("{token:'"+token+"'}");
		// respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
	}
   public void GetGift1GBByGUI(JObject jo)
    {
        string GUI = (string)jo["GUI"];
        string AccountTotalRent = (string)jo["AccountTotalRent"];
        string ProductPrice = (string)jo["ProductPrice"];
        string PostData = "{\"GUI\":\"" + GUI + "\"}";
        string PostURL = wspathNet + "GetGift1GBByGUI";
        object resp = ToJson(PostWebService(PostURL, PostData));
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }  
   public void changeAccount(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string cuenta = jo["cuenta"].ToString();
        string suscriptor = jo["suscriptor"].ToString();
        string PostData = "{}";

        string PostURL = wspathNet2 + "user/account/default/"+cuenta+"/"+suscriptor;
        object resp = ToJson(putWebService(PostURL, PostData,token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public void deleteAccount(JObject jo)
    {

        string token = (string)jo["token"].ToString();
        string cuenta = (string)jo["cuenta"];
   
        string PostURL = wspathNet2 + "user/account/" + cuenta + "";

        //curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");        
        object resp = ToJson(deleteWebService(PostURL, token));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void updatePassword(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string oldPassword = jo["oldPassword"].ToString();
        string newPassword = jo["newPassword"].ToString();
        string confirmationPassword = jo["confirmationPassword"].ToString();
        string PostData = "{\"oldPassword\":\"" + oldPassword + "\",\"newPassword\":\"" + newPassword + "\",\"confirmationPassword\":\"" + confirmationPassword + "\"}";

        string PostURL = wspathNet2 + "user/password";
        object resp = ToJson(putWebService(PostURL, PostData,token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
   public void updateEmailAndPassword(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string newEmail = jo["newEmail"].ToString();
        string oldPassword = jo["oldPassword"].ToString();
        string newPassword = jo["newPassword"].ToString();
        string confirmationPassword = jo["confirmationPassword"].ToString();
        string channel = "miclaro-web";
        string accountNumber = jo["accountNumber"].ToString();
        string PostData = "{\"newEmail\":\"" + newEmail + "\",\"oldPassword\":\"" + oldPassword + "\",\"newPassword\":\"" + newPassword + "\",\"confirmationPassword\":\"" + confirmationPassword + "\",\"channel\":\"" + channel + "\",\"accountNumber\":\"" + accountNumber + "\"}";

        string PostURL = wspathNet2 + "user/updateUserNameAndPassword";
        object resp = ToJson(putWebService(PostURL, PostData,token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
   
    //------
    public void UpdatePersonalDir(JObject jo)
    {
        string BAN = (string)jo["BAN"];
        string token = (string)jo["token"].ToString();
        string AddressDet = (string)jo["AddressDet"];
        string AddressDet2 = (string)jo["AddressDet2"];
        string City = (string)jo["City"];
        string zip = (string)jo["zip"];


        string PostData = "{\"BAN\":\"" + BAN + "\",\"token\":\"" + token + "\",\"AddressDet\":\"" + AddressDet + "\",\"AddressDet2\":\"" + AddressDet2 + "\",\"City\":\"" + City + "\",\"zip\":\"" + zip + "\"}";
        string PostURL = wspathNetV3 + "UpdatePersonalDir";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   

   public void UpdatePersonalData(JObject jo)
    {


        string BAN = (string)jo["BAN"];
        string token = (string)jo["token"].ToString();
        string Email = (string)jo["Email"];
        string PhoneNumber = (string)jo["PhoneNumber"];
        string PhoneNumber2 = (string)jo["PhoneNumber2"];


        string PostData = "{\"BAN\":\"" + BAN + "\",\"token\":\"" + token + "\",\"Email\":\"" + Email + "\",\"PhoneNumber\":\"" + PhoneNumber + "\",\"PhoneNumber2\":\"" + PhoneNumber2 + "\"}";
        string PostURL = wspathNetV3 + "UpdatePersonalData";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetNotToCallStatus(JObject jo)
    {
        string BAN = (string)jo["BAN"];
        string token = (string)jo["token"].ToString();
        string Subscriber = (string)jo["Subscriber"];
        string PostData = "{\"BAN\":\"" + BAN + "\",\"Subscriber\":\"" + Subscriber + "\"}";
        string PostURL = wspathNet + token + "/GetNotToCallStatus";
        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
   }
   public void NotToCall(JObject jo)
    {
        string BAN = (string)jo["BAN"];
        string token = (string)jo["token"].ToString();
        string Action = (string)jo["Action"];
        string Subscriber = (string)jo["Subscriber"];

        string PostData = "{\"token\":\"" + token + "\",\"BAN\":\"" + BAN + "\",\"Action\":\"" + Action + "\",\"Subscriber\":\"" + Subscriber + "\"}";
        string PostURL = wspathNetV3 + token + "/NotToCall";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
   public void GetReadSubscriber(JObject jo)
    {


        string TransactionId = (string)jo["TransactionId"];
        string IdSubscriber = (string)jo["IdSubscriber"];


        string PostData = "{\"TransactionId\":\"" + TransactionId + "\",\"IdSubscriber\":\"" + IdSubscriber + "\"}";
        string PostURL = wspathNetV3 + "GetReadSubscriber";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   
   
    public void GetReadGroup(JObject jo)
    {

        string GroupId = (string)jo["GroupId"];
        string TransactionId = (string)jo["TransactionId"];
        string GetBalances = (string)jo["GetBalances"];


        string PostData = "{\"GroupId\":\"" + GroupId + "\",\"TransactionId\":\"" + TransactionId + "\",\"GetBalances\":\"" + GetBalances + "\"}";
        string PostURL = wspathNet + "GetReadGroup";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    
    public void GetOffersFromOfferGroup(JObject jo)
    {

        string TransactionId = (string)jo["TransactionId"];
        string OfferGroup = (string)jo["OfferGroup"];


        string PostData = "{\"TransactionId\":\"" + TransactionId + "\",\"OfferGroup\":\"" + OfferGroup + "\"}";
        string PostURL = wspathNet + "GetOffersFromOfferGroup";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    
    public void GetOffersToSubscriberFromOfferGroup(JObject jo)
    {

        string TransactionId = (string)jo["TransactionId"];
        string SubscriberId = (string)jo["SubscriberId"];
        string OfferGroup = (string)jo["OfferGroup"];

        string PostData = "{\"TransactionId\":\"" + TransactionId + "\",\"SubscriberId\":\"" + SubscriberId + "\",\"OfferGroup\":\"" + OfferGroup + "\"}";
        string PostURL = wspathNetV3 + "GetOffersToSubscriberFromOfferGroup";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void AddOffersToSubscriber(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string TransactionId = (string)jo["TransactionId"];
        string SubscriberId = (string)jo["SubscriberId"];
        string OfferId = (string)jo["OfferId"];
        string Charge = (string)jo["Charge"];
        string Cicle = (string)jo["Cicle"].ToString();
        string paymentID = (string)jo["paymentID"];
        string UserID = (string)jo["UserID"];

        string PostData = "{\"TransactionId\":\"" + TransactionId + "\",\"SubscriberId\":\"" + SubscriberId + "\",\"OfferId\":\"" + OfferId + "\",\"Charge\":\"" + Charge + "\",\"Cicle\":\"" + Cicle + "\",\"token\":\"" + token + "\",\"paymentID\":\"" + paymentID + "\",\"UserID\":\"" + UserID + "\"}";
        string PostURL = wspathNetV3 + "AddOffersToSubscriber";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   public void ValidateCreditLimit(JObject jo)
    {

        string Ban = jo["Ban"].ToString();
        string AccountTotalRent = jo["AccountTotalRent"].ToString();
        string ProductPrice = jo["ProductPrice"].ToString();

        string PostData = "{\"Ban\":\"" + Ban + "\",\"AccountTotalRent\":\"" + AccountTotalRent + "\",\"ProductPrice\":\"" + ProductPrice + "\"}";
        string PostURL = wspathNet + "ValidateCreditLimit";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetOffersToSubscriber(JObject jo)
    {

        string TransactionId = (string)jo["TransactionId"];
        string SubscriberId = (string)jo["SubscriberId"];

        string PostData = "{\"TransactionId\":\"" + TransactionId + "\",\"SubscriberId\":\"" + SubscriberId + "\"}";
        string PostURL = wspathNet + "GetOffersToSubscriber";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    
    public void AddOffersToGroup(JObject jo)
    {

        string TransactionId = (string)jo["TransactionId"];
        string RequesterId = (string)jo["RequesterId"];
        string OfferId = (string)jo["OfferId"];
        string Charge = (string)jo["Charge"];
        string Cicle = (string)jo["Cicle"];
        string GroupId = (string)jo["GroupId"];
        string paymentID = (string)jo["paymentID"];

        string UserID = (string)jo["UserID"];
        string token = (string)jo["token"].ToString();


        string PostData = "{\"paymentID\":\"" + paymentID + "\",\"UserID\":\"" + UserID + "\",\"token\":\"" + token + "\",\"TransactionId\":\"" + TransactionId + "\",\"RequesterId\":\"" + RequesterId + "\",\"OfferId\":\"" + OfferId + "\",\"Charge\":\"" + Charge + "\",\"Cicle\":\"" + Cicle + "\",\"GroupId\":\"" + GroupId + "\"}";
        string PostURL = wspathNet + "AddOffersToGroup";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void UpdateBasicRegister(JObject jo)
    {

        string username = (string)jo["username"];
        string QUESTION_ID = (string)jo["QUESTION_ID"];
        string ANSWER = (string)jo["ANSWER"];
        string PIN_QUESTION_ID = (string)jo["PIN_QUESTION_ID"];
        string PIN_QUESTION_ANSWER = (string)jo["PIN_QUESTION_ANSWER"];
        string NewSCRPIN = (string)jo["NewSCRPIN"];
        string token = Session["token"].ToString();


        string PostData = "{\"username\":\"" + username + "\",\"QUESTION_ID\":\"" + QUESTION_ID + "\",\"ANSWER\":\"" + ANSWER + "\",\"PIN_QUESTION_ID\":\"" + PIN_QUESTION_ID + "\",\"PIN_QUESTION_ANSWER\":\"" + PIN_QUESTION_ANSWER + "\",\"NewSCRPIN\":\"" + NewSCRPIN + "\",\"token\":\"" + token + "\"}";
        string PostURL = wspathNet + "UpdateBasicRegister";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void getPlanes2(JObject jo)
    {

        string token = (string)jo["token"].ToString();
        string soc = (string)jo["soc"];
        string tecnology = (string)jo["tecnology"];
        string customerType = (string)jo["customerType"];
        string creditClass = (string)jo["creditClass"];
        string customerSubType = (string)jo["customerSubType"];
        string price = (string)jo["price"].ToString();


        string PostData = "{\"soc\":\"" + soc + "\",\"tecnology\":\"" + tecnology + "\",\"customerType\":\"" + customerType + "\",\"creditClass\":\"" + creditClass + "\",\"customerSubType\":\"" + customerSubType + "\",\"price\":\"" + price + "\"}";
        string PostURL = wspathNet2 + "soc/getSoc";


        object resp = ToJson(PostWebService2(PostURL, PostData,token));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void getPlanes(JObject jo)
    {

        string token = Session["token"].ToString();
        string creditClass = (string)jo["creditClass"];
        string itemId = (string)jo["itemId"];
        string commitMonths = (string)jo["commitMonths"];
        string pricePlan = (string)jo["pricePlan"];
        string currentPlan = (string)jo["currentPlan"];


        string PostData = "{\"token\":\"" + token + "\",\"creditClass\":\"" + creditClass + "\",\"itemId\":\"" + itemId + "\",\"commitMonths\":\"" + commitMonths + "\",\"pricePlan\":\"" + pricePlan + "\",\"currentPlan\":\"" + currentPlan + "\"}";
        string PostURL = wspathNet + "Cart/Plans";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   
    public void adaDslPackageChange(JObject jo)
    {

        string token = (string)jo["token"].ToString();
        string alphaCodeContract = (string)jo["alphaCodeContract"];
        string contract = (string)jo["contract"];
        string dslPhoneNumber = (string)jo["dslPhoneNumber"];
        string productId = (string)jo["productId"];
        string dslBan = (string)jo["dslBan"];
        string oldSocPrice = (string)jo["oldSocPrice"];
        string ProductType = (string)jo["ProductType"];
        


        string PostData = "{\"alphaCodeContract\":\"" + alphaCodeContract + "\",\"contract\":\"" + contract + "\",\"dslPhoneNumber\":\"" + dslPhoneNumber + "\",\"productId\":\"" + productId + "\",\"dslBan\":\"" + dslBan + "\",\"oldSocPrice\":\"" + oldSocPrice + "\",\"ProductType\":\"" + ProductType + "\",\"token\":\"" + token + "\"}";
        string PostURL = wspathNetV3 + "AdaDslPackageChange";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void DSLCatalog(JObject jo)
    {

        string phoneNumber = (string)jo["phoneNumber"].ToString();
        string token = (string)jo["token"].ToString();


        string PostData = "{\"phoneNumber\":\"" + phoneNumber + "\",\"token\":\"" + token + "\"}";
        string PostURL = wspathNet + "/DSLCatalog";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void SetMasterReservation(JObject jo)
    {

        string TransactionId = (string)jo["TransactionId"];
        string RequesterId = (string)jo["RequesterId"];
        string GroupId = (string)jo["GroupId"];
        string ReservationLimit = (string)jo["ReservationLimit"];

        string PostData = "{\"TransactionId\":\"" + TransactionId + "\",\"RequesterId\":\"" + RequesterId + "\",\"GroupId\":\"" + GroupId + "\",\"ReservationLimit\":\"" + ReservationLimit + "\"}";
        string PostURL = wspathNet + "/SetMasterReservation";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void UpdateGroup(JObject jo)
    {

        string TransactionId = (string)jo["TransactionId"];
        string GroupId = (string)jo["GroupId"];
        string MasterSubscriberId = (string)jo["MasterSubscriberId"];
        string RequesterId = (string)jo["RequesterId"];

        string PostData = "{\"TransactionId\":\"" + TransactionId + "\",\"GroupId\":\"" + GroupId + "\",\"MasterSubscriberId\":\"" + MasterSubscriberId + "\",\"RequesterId\":\"" + RequesterId + "\"}";
        string PostURL = wspathNet + "/UpdateGroup";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   public void SetLimitUpdate(JObject jo)
    {

        string Ban = (string)jo["Ban"];

        string PostData = "{\"Ban\":\"" + Ban + "\"}";
        string PostURL = wspathNet + "/SetLimitUpdate";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   public void updateSubscriberPricePlanSocs(JObject jo)
    {


        string token = (string)jo["token"].ToString();
        string OldSocCode = (string)jo["OldSocCode"];
        string NewSocCode = (string)jo["NewSocCode"];
        string mProductType = (string)jo["mProductType"];
        string mSubscriberNo = (string)jo["mSubscriberNo"];
       


        string PostData = "{\"token\":\"" + token + "\",\"OldSocCode\":\"" + OldSocCode + "\",\"NewSocCode\":\"" + NewSocCode + "\",\"mProductType\":\"" + mProductType + "\",\"mSubscriberNo\":\"" + mSubscriberNo + "\"}";
        string PostURL = wspathNetV3 + "updateSubscriberPricePlanSocs";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void updateSubscriberPricePlanSocsNextCicle(JObject jo)
    {


        string token = (string)jo["token"].ToString();
        string OldSocCode = (string)jo["OldSocCode"];
        string NewSocCode = (string)jo["NewSocCode"];
        string mProductType = (string)jo["mProductType"];
        string mSubscriberNo = (string)jo["mSubscriberNo"];
        string BAN = (string)jo["BAN"];


        string PostData = "{\"token\":\"" + token + "\",\"OldSocCode\":\"" + OldSocCode + "\",\"NewSocCode\":\"" + NewSocCode + "\",\"mProductType\":\"" + mProductType + "\",\"mSubscriberNo\":\"" + mSubscriberNo + "\",\"BAN\":\"" + BAN + "\"}";
        string PostURL = wspathNetV3 + "updateSubscriberPricePlanSocsNextCicle";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetLimitUpdate(JObject jo)
    {


        string Ban = (string)jo["Ban"];
        string cicleDateStart = (string)jo["cicleDateStart"];


        string PostData = "{\"Ban\":\"" + Ban + "\",\"cicleDateStart\":\"" + cicleDateStart + "\"}";
        string PostURL = wspathNet + "/GetLimitUpdate";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void SetSubscriberGroupLimit(JObject jo)
    {

        string RequesterId = (string)jo["RequesterId"];
        string TransactionId = (string)jo["TransactionId"];
        string GroupId = (string)jo["GroupId"];
        string SubscriberId = (string)jo["SubscriberId"];
        string Percentage = (string)jo["Percentage"];

        string PostData = "{\"RequesterId\":\"" + RequesterId + "\",\"TransactionId\":\"" + TransactionId + "\",\"GroupId\":\"" + GroupId + "\",\"SubscriberId\":\"" + SubscriberId + "\",\"Percentage\":\"" + Percentage + "\"}";
        string PostURL = wspathNet + "/SetSubscriberGroupLimit";

        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void Reconnect(JObject jo)
    {

        string token = Session["token"].ToString();
        string Ban = (string)jo["Ban"];
        string Subscriber = (string)jo["Subscriber"];
        string Amount = (string)jo["Amount"];

        string PostData = "{\"Ban\":\"" + Ban + "\",\"Subscriber\":\"" + Subscriber + "\",\"Amount\":\"" + Amount + "\",\"token\":\"" + token + "\"}";
        string PostURL = wspathNet + "/Reconnect";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   public void addAccounts(JObject jo)
    {

        string token = Session["token"].ToString();
        string accountNumber = (string)jo["accountNumber"];
        string ssn = (string)jo["ssn"];
        string defaultAccount = (string)jo["defaultAccount"];

        string PostData = "{\"accountNumber\":\"" + accountNumber + "\",\"ssn\":\"" + ssn + "\",\"defaultAccount\":\"" + defaultAccount + "\"}";
        string PostURL = wspathNet2 + "user/account";


        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void getAccounts(JObject jo)
    {

        string token = (string)jo["token"].ToString();

        string PostData = "{\"token\":\"" + token + "\"}";
        string getURL = wspathNet2 + "user/accounts";

        object resp = ToJson(getWebService(getURL, PostData, token));



        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void getUserAccount(JObject jo)
    {
        string getURL = wspathNet2 + "user/accounts";
        object resp = ToJson(getWebService(getURL));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
   public void GetActiveOfferPlans(JObject jo)
    {
        string token = Session["token"].ToString();
        string Subscriber = jo["Subscriber"].ToString();

        string gettURL = wspathNet + "/Cart/" + token + "/B/50652/24/Plans?_=1420292719967";

        object resp = ToJson(getWebService(gettURL));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public void makePaymentATH(JObject jo)
    {

        string token = Session["token"].ToString();
        string TransType = jo["TransType"].ToString();
        string CardNum = jo["CardNum"].ToString();
        string ExpDate = jo["ExpDate"].ToString();
        string MagData = jo["MagData"].ToString();
        string NameOnCard = jo["NameOnCard"].ToString();
        string Amount = jo["Amount"].ToString();
        string InvNum = jo["InvNum"].ToString();
        string PNRef = jo["PNRef"].ToString();
        string Zip = jo["Zip"].ToString();
        string Street = jo["Street"].ToString();
        string CVNum = jo["CVNum"].ToString();
        string ExtData = jo["ExtData"].ToString();
        string ClientApp = jo["ClientApp"].ToString();
        string CustomerId = jo["CustomerId"].ToString();
        string PayType = jo["PayType"].ToString();
        string cellphone = jo["cellphone"].ToString();
        string state = jo["state"].ToString();
        string city = jo["city"].ToString();
        string email = jo["email"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"TransType\":\"" + TransType + "\",\"CardNum\":\"" + CardNum + "\",\"ExpDate\":\"" + ExpDate + "\",\"MagData\":\"" + MagData + "\",\"NameOnCard\":\"" + NameOnCard + "\",\"Amount\":\"" + Amount + "\",\"InvNum\":\"" + InvNum + "\",\"PNRef\":\"" + PNRef + "\",\"Zip\":\"" + Zip + "\",\"Street\":\"" + Street + "\",\"CVNum\":\"" + CVNum + "\",\"ExtData\":\"" + ExtData + "\",\"ClientApp\":\"" + ClientApp + "\",\"CustomerId\":\"" + CustomerId + "\",\"PayType\":\"" + PayType + "\",\"cellphone\":\"" + cellphone + "\",\"state\":\"" + state + "\",\"city\":\"" + city + "\",\"email\":\"" + email + "\"}";

        string PostURL = wspathNet + "/makePayment";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void makePayment(JObject jo)
    {

        string token = (string)jo["token"].ToString();
        string ClientApp = jo["ClientApp"].ToString();
        string CustomerId = (string)jo["CustomerId"].ToString();
        string PayType = jo["PayType"].ToString();
        string cellphone = jo["cellphone"].ToString();
        string city = jo["city"].ToString();
        string email = jo["email"].ToString();
        string state = jo["state"].ToString();
        string description = jo["description"].ToString();
        string TransType = jo["TransType"].ToString();
        string CardNum = jo["CardNum"].ToString();
        string ExpDate = jo["ExpDate"].ToString();
        string MagData = jo["MagData"].ToString();
        string NameOnCard = jo["NameOnCard"].ToString();
        string Amount = jo["Amount"].ToString();
        string InvNum = jo["InvNum"].ToString();
        string PNRef = jo["PNRef"].ToString();
        string Zip = jo["Zip"].ToString();
        string Street = jo["Street"].ToString();
        string CVNum = jo["CVNum"].ToString();
        string ExtData = jo["ExtData"].ToString();
        string account = jo["account"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"ClientApp\":\"" + ClientApp + "\",\"CustomerId\":\"" + CustomerId + "\",\"PayType\":\"" + PayType + "\",\"cellphone\":\"" + cellphone + "\",\"city\":\"" + city + "\",\"email\":\"" + email + "\",\"state\":\"" + state + "\",\"description\":\"" + description + "\",\"TransType\":\"" + TransType + "\",\"CardNum\":\"" + CardNum + "\",\"ExpDate\":\"" + ExpDate + "\",\"MagData\":\"" + MagData + "\",\"NameOnCard\":\"" + NameOnCard + "\",\"Amount\":\"" + Amount + "\",\"InvNum\":\"" + InvNum + "\",\"PNRef\":\"" + PNRef + "\",\"Zip\":\"" + Zip + "\",\"Street\":\"" + Street + "\",\"CVNum\":\"" + CVNum + "\",\"ExtData\":\"" + ExtData + "\",\"account\":\"" + account + "\"}";

        string PostURL = wspathNetV3 + "makePayment";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetPlanInfo(JObject jo)
    {

        string Ban = jo["Ban"].ToString();
        string token = Session["token"].ToString();
        string subscriber = jo["subscriber"].ToString();
        string mSocCode = jo["mSocCode"].ToString();
        string svaSocCode = jo["svaSocCode"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"Ban\":\"" + Ban + "\",\"subscriber\":\"" + subscriber + "\",\"mSocCode\":\"" + mSocCode + "\",\"svaSocCode\":\"" + svaSocCode + "\"}";

        string PostURL = wspathNet + "/GetPlanInfo";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void Reconnect2(JObject jo)
    {

        string Ban = jo["Ban"].ToString();
        string Subscriber = jo["Subscriber"].ToString();
        string Amount = jo["Amount"].ToString();
        string token = (string)jo["token"].ToString();
        string PostData = "{\"Ban\":\"" + Ban + "\",\"Subscriber\":\"" + Subscriber + "\",\"Amount\":\"" + Amount + "\",\"token\":\"" + token + "\"}";

        string PostURL = wspathNet + "/Reconnect";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void ClosePaymentATH(JObject jo)
    {

        string token = Session["token"].ToString();
        string RequestID = jo["RequestID"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"RequestID\":\"" + RequestID + "\"}";

        string PostURL = wspathNet+"/ClosePaymentATH";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void AddGift1GB(JObject jo)
    {

        string token = (string)jo["token"].ToString();
        string NameSender = jo["NameSender"].ToString();
        string BANSender = jo["BANSender"].ToString();
        string SubscriberSender = jo["SubscriberSender"].ToString();
        string BANReceiver = jo["BANReceiver"].ToString();
        string SubscriberReceiver = jo["SubscriberReceiver"].ToString();
        string Message = jo["Message"].ToString();
        string Charge = jo["Charge"].ToString();
        string PaymentID = jo["PaymentID"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"NameSender\":\"" + NameSender + "\",\"BANSender\":\"" + BANSender + "\",\"SubscriberSender\":\"" + SubscriberSender + "\",\"BANReceiver\":\"" + BANReceiver + "\",\"SubscriberReceiver\":\"" + SubscriberReceiver + "\",\"Message\":\"" + Message + "\",\"Charge\":\"" + Charge + "\",\"PaymentID\":\"" + PaymentID + "\"}";

        string PostURL = wspathNetV3+"AddGift1GB";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void UpdateAlerts(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string alertList = jo["alertList"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"alertList\":\"" + alertList + "\"}";
        string PostURL = wspathNetV3 +"UpdateAlerts";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void authMixed(JObject jo)
    {

        string user = (string)jo["Username"].ToString();
        string password = (string)jo["Password"].ToString();

        UsersResponse objLoginAPI = AuthAPI(user, password);

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(objLoginAPI));//resp
        Response.End();


    }

    public void getAuthByToken(JObject jo)
    {

        string token = (string)jo["token"].ToString(); 
        string password = (string)jo["password"].ToString();
        //string resultEncrip = encriptar128(password);
        getAuthByToken(token);

    }


    public void autenticar(JObject jo)
    { 

        string user = (string)jo["user"].ToString(); //Base64Decode((string)jo["user"].ToString());
        string password = (string)jo["password"].ToString();
        //string resultEncrip = encriptar128(password);
        AuthMix(user, password);

    }

   
    




    public void validatePrepaid(JObject jo)
    {

        string prepaidNumber = jo["prepaidNumber"].ToString();
        string PostData = "{\"prepaidNumber\":\"" + prepaidNumber + "\"}";

        string PostURL = wspathNetPrepaid + "Prepaid/validatePrepaidAccount";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End(); 

    }


    public string encriptar128(string pass)
    {
        string response = "";
        if (!System.String.IsNullOrEmpty(pass))
        {

            string text = Base64Decode(pass);

            CryptoClass objCrypt = new CryptoClass();
            string result = objCrypt.encryptAES128(text);
            response = result;
        }
        return response;
    }
   public void changePassword(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string questionid = jo["questionid"].ToString();
        string answer = jo["answer"].ToString();
        string newPassword = jo["newPassword"].ToString();
        string password = jo["password"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"password\":\"" + password + "\",\"questionid\":\"" + questionid + "\",\"answer\":\"" + answer + "\",\"newPassword\":\"" + newPassword + "\"}";

        string PostURL = wspathNetV3 + "changePassword";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   public void changePassword2(JObject jo)
    {
        string newPassword = jo["newPassword"].ToString();
        string token = Session["token"].ToString();
        string username = jo["username"].ToString();
        string OldPassword = jo["OldPassword"].ToString();
        string PostData = "{\"username\":\"" + username + "\",\"newPassword\":\"" + newPassword + "\",\"OldPassword\":\"" + OldPassword + "\"}";

        string PostURL = wspathNet +"changePassword2";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetProyectionImage(JObject jo)
    {


        string BAN = jo["BAN"].ToString();
        string token = Session["token"].ToString();
        string Subscriber = jo["Subscriber"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"BAN\":\"" + BAN + "\",\"Subscriber\":\"" + Subscriber + "\"}";

        string PostURL = wspathNet + token + "/GetProyectionImage";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetOrders(JObject jo)
    {


        string Ban = jo["Ban"].ToString();
        string token = Session["token"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"Ban\":\"" + Ban + "\"}";

        string PostURL = wspathNet + "GetOrders";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
   public void BAN(JObject jo)
    {


        string BAN = jo["BAN"].ToString();
        string token = Session["token"].ToString(); 


        string PostData = "{\"token\":\"" + token + "\",\"BAN\":\"" + BAN + "\"}";

        string PostURL = wspathNet + "BAN";
        object resp = ToJson(PostWebService(PostURL, PostData));


        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
	private string PostWebService3(string url, string Post, string token)
    {

        string response = "";

        try
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2

            var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            httpWebRequest.Accept = "application/json";
            httpWebRequest.Headers.Add("api-key: " + wspathNetApiKey);
            httpWebRequest.Headers.Add("token: " + token);

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                streamWriter.Write(Post);
                streamWriter.Flush();
                streamWriter.Close();
                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    response = streamReader.ReadToEnd();
                }
            }
        }
        catch (WebException ex)
        {
            response = "{\"response\": false,\"hasError\": true,\"desc\": \"Se capturo un intento de acceso no autorizado\",\"code\": \"001\"}";
        }

        return response;


    }
	public void getStatusGuarantee(JObject jo)
    {
        string PostData = "";
        string subscribers = jo["subscribers"].ToString();
        string token = Session["token"].ToString();
        if (subscribers != "")
        {
            PostData = "{\"subscribers\":" + subscribers + "}";
        }
        else
        {
            PostData = "{\"subscribers\":" + subscribers + "}";
        }
        
        string PostURL = wspathNet2+ "/user/tickets";


       

        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
	public void sendFailure(JObject jo)
    {

        string accountNumber = jo["accountNumber"].ToString();
        string accountType = jo["accountType"].ToString();
        string accountSubType = jo["accountSubType"].ToString();
        string subscriber = jo["subscriber"].ToString();
        string productType = jo["productType"].ToString();
        string message = jo["message"].ToString();
        string contactNumber1 = jo["contactNumber1"].ToString();
        string contactNumber2 = jo["contactNumber2"].ToString();
        string token = Session["token"].ToString();
        string PostData = "{\"accountNumber\":\"" + accountNumber + "\",\"accountType\":\"" + accountType + "\",\"accountSubType\":\"" + accountSubType + "\",\"subscriber\":\"" + subscriber + "\",\"productType\":\"" + productType + "\",\"message\":\"" + message + "\",\"contactNumber1\":\"" + contactNumber1 + "\",\"contactNumber2\":\"" + contactNumber2 + "\"}";

        string PostURL = wspathNet2 + "/fixed-fault-report/reportFailure";
        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
	public void getSVAList(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string tier = jo["tier"].ToString();
        string date = jo["date"].ToString(); 
        string socs = jo["socs"].ToString();

        string PostData = "{\"tier\":\"" + tier + "\",\"date\":\"" + date + "\",\"socs\":[\"" + socs + "\"]}";
        if (socs.Length > 10)
        {
            socs = socs.Substring(6, socs.Length - 10);
            PostData = "{\"tier\":\"" + tier + "\",\"date\":\"" + date + "\",\"socs\":[\"" + socs + "\"]}";
        }
        else
        {
            PostData = "{\"tier\":\"" + tier + "\",\"date\":\"" + date + "\"}";
        }
       
        string PostURL = wspathNet2 + "sva/list"; 
        object resp = ToJson(PostWebService3(PostURL, PostData, token));

        // respuesta json. 
        Response.Clear();  
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp)); //
        Response.End();

    }
	public void buySVA(JObject jo)
    {
        string soc = jo["soc"].ToString();
        string accountFrom = jo["accountFrom"].ToString();
        string subscriberFrom = jo["subscriberFrom"].ToString();
        string channel = jo["channel"].ToString();
        string invoiceCharge = jo["invoiceCharge"].ToString();
        string amount = jo["amount"].ToString();
        string token = Session["token"].ToString();
        string PostData = "{\"soc\":\"" + soc + "\",\"accountFrom\":\"" + accountFrom + "\",\"subscriberFrom\":\"" + subscriberFrom + "\",\"channel\":\"" + channel + "\",\"invoiceCharge\":\"" + invoiceCharge + "\",\"amount\":\"" + amount + "\"}";
        string PostURL = wspathNet2 + "/sva/buy";
        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
	public void pay(JObject jo)
    {
        string transactionId = jo["transactionId"].ToString();
        string type = jo["type"].ToString();
        string subscriber = jo["subscriber"].ToString();
        string zip = jo["zip"].ToString();
        string cardNum = jo["cardNum"].ToString();
        string amount = jo["amount"].ToString();
        string street = jo["street"].ToString();
        string cvNum = jo["cvNum"].ToString();
        string accountNumber = jo["accountNumber"].ToString();
        string expDate = jo["expDate"].ToString();
        string token = Session["token"].ToString();
        string PostData = "{\"transactionId\":\"" + transactionId + "\",\"type\":\"" + type + "\",\"subscriber\":\"" + subscriber + "\",\"zip\":\"" + zip + "\",\"cardNum\":\"" + cardNum + "\",\"amount\":\"" + amount + "\",\"street\":\"" + street + "\",\"cvNum\":\"" + cvNum + "\",\"accountNumber\":\"" + accountNumber + "\",\"expDate\":\"" + expDate + "\"}";
        string PostURL = wspathNet2 + "payment/pay";
        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
	public void updateDirectDebit(JObject jo)
    {
        string type = jo["type"].ToString();
        string creditCardNo = jo["creditCardNo"].ToString();
        string creditCardMemberName = jo["creditCardMemberName"].ToString();
        string creditCardType = jo["creditCardType"].ToString();
        string creditCardExpDate = jo["creditCardExpDate"].ToString();
        string startDate = jo["startDate"].ToString();
        string bankAccountNo = jo["bankAccountNo"].ToString();
        string endDate = jo["endDate"].ToString();
        string bankCode = jo["bankCode"].ToString();
        string accountNumber = jo["accountNumber"].ToString();
        string token = (string)jo["token"].ToString();
        string PostData = "{\"type\":\"" + type + "\",\"creditCardNo\":\"" + creditCardNo + "\",\"creditCardMemberName\":\"" + creditCardMemberName + "\",\"creditCardType\":\"" + creditCardType + "\",\"creditCardExpDate\":\"" + creditCardExpDate + "\",\"startDate\":\"" + startDate + "\",\"bankAccountNo\":\"" + bankAccountNo + "\",\"endDate\":\"" + endDate + "\",\"bankCode\":\"" + bankCode + "\",\"accountNumber\":\"" + accountNumber + "\"}";
        //string PostURL = wspathNetV3 + "/direct-debit/updateDirectDebit";
        string PostURL = "http://wsv3qa.clarotodo.com/Service/v3/direct-debit/updateDirectDebit";
        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
	public void getFailure(JObject jo)
    {
        string subscriber = jo["subscriber"].ToString();
        string token = Session["token"].ToString();
        string PostData = "{\"subscriber\":\"" + subscriber + "\"}";
        string PostURL = wspathNet2 + "/fixed-fault-report/getFailure";
        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
	public void createInstallment(JObject jo)
    {
        string accountFrom = jo["accountFrom"].ToString();
        string subscriberFrom = jo["subscriberFrom"].ToString();
        string channel = jo["channel"].ToString();
        string amount = jo["amount"].ToString();
        string quantity = jo["quantity"].ToString();
        string equipmentName = jo["equipmentName"].ToString();
        string token = (string)jo["token"].ToString();
        string PostData = "{\"accountFrom\":\"" + accountFrom + "\",\"subscriberFrom\":\"" + subscriberFrom + "\",\"channel\":\"" + channel + "\",\"amount\":\"" + amount + "\",\"quantity\":\"" + quantity + "\",\"equipmentName\":\"" + equipmentName + "\"}";
        string PostURL = wspathNet2 + "/installment/create";
        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void getDirectDebitInfo(JObject jo)
    {
        string Ban = jo["accountNumber"].ToString();
        string token = (string)jo["token"].ToString();
        string PostData = "{\"Ban\":\"" + Ban + "\",\"token\":\"" + token + "\"}";
        string PostURL = "http://wsv3qa.clarotodo.com/Service/v3/GetDirectDebit";
        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public void getDirectDebitInfo2(JObject jo)
    {
        string Ban = jo["accountNumber"].ToString();
        string token = (string)jo["token"].ToString();
        string PostData = "{\"Ban\":\"" + Ban + "\",\"token\":\"" + token + "\"}";
        string PostURL = "http://wsv3qa.clarotodo.com/Service/v3/GetDirectDebit";
        object resp = ToJson(PostWebService3(PostURL, PostData, token));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public void GetSubscriber(JObject jo)
    {


        string Subscriber = jo["Subscriber"].ToString();
        string token = (string)jo["token"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"Subscriber\":\"" + Subscriber + "\"}";

        string PostURL = wspathNetV3 + "GetSubscriber";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
		

    }
    public void GetPersonalData(JObject jo)
    {


        string BAN = jo["BAN"].ToString();
        string token = jo["token"].ToString();  //Session["token"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"BAN\":\"" + BAN + "\"}";

        string PostURL = wspathNetV3 + "GetPersonalData";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetPersonalAlertsAndNTCStatus(JObject jo)
    {
        string BAN = jo["BAN"].ToString();
        string token = jo["token"].ToString();
        string Subscriber = jo["Subscriber"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"BAN\":\"" + BAN + "\",\"Subscriber\":\"" + Subscriber + "\"}";

        //string PostURL = wspathNet + "GetPersonalAlertsAndNTCStatus";
        string PostURL = wspathNetV3 + "GetPersonalAlertsAndNTCStatus";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void UpdatePin(JObject jo)
    {
        string username = jo["username"].ToString();
        string PIN_QUESTION_ID = jo["PIN_QUESTION_ID"].ToString();
        string PIN_QUESTION_ANSWER = jo["PIN_QUESTION_ANSWER"].ToString();
        string NewSCRPIN = jo["NewSCRPIN"].ToString();
        string token = Session["token"].ToString();

        string PostData = "{\"username\":\"" + username + "\",\"PIN_QUESTION_ID\":\"" + PIN_QUESTION_ID + "\",\"PIN_QUESTION_ANSWER\":\"" + PIN_QUESTION_ANSWER + "\",\"NewSCRPIN\":\"" + NewSCRPIN + "\",\"token\":\"" + token + "\"}";

        string PostURL = wspathNet + "UpdatePin";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetSVA(JObject jo)
    {
        string token = Session["token"].ToString();
        string creditClass = jo["creditClass"].ToString();
        string DEVICE_ID = jo["DEVICE_ID"].ToString();
        string commitMonths = jo["commitMonths"].ToString();
        string offerid = jo["offerid"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"creditClass\":\"" + creditClass + "\",\"DEVICE_ID\":\"" + DEVICE_ID + "\",\"commitMonths\":\"" + commitMonths + "\",\"offerid\":\"" + offerid + "\"}";

        string PostURL = wspathNet + "Cart/SVA";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void GetPersonalAlerts(JObject jo)
    {


        string BAN = jo["BAN"].ToString();
        string token = Session["token"].ToString();

        string PostData = "{\"token\":\"" + token + "\",\"BAN\":\"" + BAN + "\"}";

        string PostURL = wspathNet + "GetPersonalAlerts";
        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();

    }
    public void getBan(JObject jo){
    
        string BAN = (string)jo["BAN"];
        string token = (string)jo["token"];

        string PostData = "{\"token\":\"" + token + "\",\"BAN\":\"" + BAN + "\"}";
        string PostURL = wspathNet + "BAN";

        object resp = ToJson(PostWebService(PostURL, PostData));

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public MobileServiceStatus authV3(string user, string password)
    {

        string PostData = "{\"user\":\"" + user + "\",\"password\":\"" + password + "\",\"token\":\"\"}";
        string PostURL = wspathNet + "getAuthMix";
        string respStr = PostWebService(PostURL, PostData);
        MobileServiceStatus objLogin = new MobileServiceStatus();
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        objLogin = serializer.Deserialize<MobileServiceStatus>(respStr.ToString());
        //if (objLogin.Success)
        //{
        //    // cargar el token en la session
        //    Session["token"] = objLogin.token;
        //    // sobrescribir el token para que no sea visible para el cliente.
        //    objLogin.token = "**************";
        //}

        return objLogin;

        //// respuesta json.
        //Response.Clear();
        //Response.ContentType = "application/json; charset=utf-8";
        //Response.Write(json.Serialize(objLogin));//resp
        //Response.End();


    }

    public UsersResponse AuthAPI(string Username, string Password)
    {


        string PostData = "{\"Username\":\"" + Username + "\",\"Password\":\"" + Password + "\"}";
        string PostURL = wspathNetLogin + "api/login/authenticate";
        string resp = PostWebService(PostURL, PostData);

        UsersResponse objInfo = new UsersResponse();
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        objInfo = serializer.Deserialize<UsersResponse>(resp.ToString());

        return objInfo;

    }

    public UsersResponse getAuthByToken(string token)
    {

       // string PostData = "{\"Username\":\"" + Username + "\",\"Password\":\"" + Password + "\"}";
        string PostURL = wspathNetLogin + "/api/login/echouser";
        string resp = getWebServiceBearer (PostURL,token);

        UsersResponse objInfo = new UsersResponse();
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        objInfo = serializer.Deserialize<UsersResponse>(resp.ToString());

        return objInfo;

    }


    public void AuthMix(string user, string password){
        string PostData = "{\"user\":\"" + user + "\",\"password\":\"" + password + "\",\"token\":\"\"}";
        string PostURL = wspathNet + "getAuthMix";
        string respStr = PostWebService(PostURL, PostData);
        MobileServiceStatus objLogin = new MobileServiceStatus();
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
        objLogin = serializer.Deserialize<MobileServiceStatus>(respStr.ToString());
		if (objLogin.Success)
        {
            // cargar el token en la session
            Session["token"] = objLogin.token;
            // sobrescribir el token para que no sea visible para el cliente.
            objLogin.token = "**************";
        }

        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(objLogin));//resp
        Response.End();
    }

    public void GetGift1GBSend(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string BAN = (string)jo["BAN"].ToString();
        string PostData = "{\"token\":\"" + token + "\",\"BAN\":\"" + BAN + "\"}";
        string PostURL = wspathNet + "GetGift1GBSend";

        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void DoPayment(JObject jo) 
    {
        string Account = (string)jo["Account"].ToString();
        string Amount = (string)jo["Amount"].ToString();
        string token = (string)jo["token"].ToString();
        string PostData = "{\"Account\":\"" + Account + "\",\"Amount\":\"" + Amount + "\",\"token\":\"" + token + "\"}";
        string PostURL = "http://wsv3qa.clarotodo.com/Service/v3/DoPayment";

        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void AuthByToken(JObject jo)
    {
        string token = (string)Session["token"].ToString();
        string PostData = "{\"token\":\"" + token + "\"}";
        string PostURL = wspathNet + "AuthByToken";

        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
  
    public void GetHistoricoFacturas(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string Ban = (string)jo["Ban"].ToString();
        string year = (string)jo["year"].ToString();
        string format = (string)jo["format"].ToString();
        string PostData = "{\"Ban\":\"" + Ban + "\",\"year\":\"" + year + "\",\"format\":\"" + format + "\",\"token\":\"" + token + "\"}";
        string PostURL = wspathNetV3 + "Invoices";

        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public void PaymentHistory(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string Ban = (string)jo["Ban"].ToString();
        string year = (string)jo["year"].ToString();
        string PostData = "{\"Ban\":\"" + Ban + "\",\"year\":\"" + year + "\",\"token\":\"" + token + "\"}";
        string PostURL = wspathNetV3 + "PaymentHistory";

        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public void GetHistoricoRechazos(JObject jo)
    {
        string token = (string)Session["token"].ToString();
        string Ban = (string)jo["Ban"].ToString();
        string PostData = "{\"Ban\":\"" + Ban + "\"}";
        string PostURL = wspathNet + token + "/" + "PaymentReverse";

        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }


    public void updateBillParameters(JObject jo)
    {
        string token = (string)jo["token"].ToString();
        string Ban = (string)jo["Ban"].ToString();
        string PostData = "{\"Ban\":\"" + Ban + "\",\"token\":\"" + token + "\"}";
        string PostURL = wspathNetV3 + "updateBillParameters";

        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void SessionIsAlive(JObject jo)
    {
        string token = (string)Session["token"].ToString();
        string PostData = "{\"token\":\"" + token + "\"}";
        string PostURL = wspathNet + "SessionIsAlive";

        object resp = ToJson(PostWebService(PostURL, PostData));
        // respuesta json.
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
    public object ToJson(string str)
    {

        System.Web.Script.Serialization.JavaScriptSerializer j = new System.Web.Script.Serialization.JavaScriptSerializer();
        object a = j.Deserialize(str, typeof(object));
        return a;
    }

    private string PostWebService(string url, string json)
    {
		string response = "";
        if (url.ToLower().StartsWith("https"))
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        }
        var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
        httpWebRequest.ContentType = "text/json";
        httpWebRequest.Method = "POST";
		using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
        {
			streamWriter.Write(json);
            streamWriter.Flush();
            streamWriter.Close();
			var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                response = streamReader.ReadToEnd();
            }
        }
		return response;
    }
    private string PostWebService(string url, string json, string token)
    {
		string response = "";
		ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
		
        httpWebRequest.Method = "POST";
        httpWebRequest.Headers.Add("api-key: " + wspathNetApiKey);
		httpWebRequest.ContentType = "text/json";
		using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
        {
			streamWriter.Write(json);
            streamWriter.Flush();
            streamWriter.Close();
			var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                response = streamReader.ReadToEnd();
            }
        }
		return response; 
    }

   
    private string PostWebServiceBearrer(string url, string Post, string token)
    {
        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        string response = "";
        var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
        httpWebRequest.ContentType = "application/json";
        httpWebRequest.Method = "POST";
        httpWebRequest.Accept = "application/json";
        httpWebRequest.Headers.Add("Authorization: Bearer " + token);

        using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
        {
            streamWriter.Write(Post);
            streamWriter.Flush();
            streamWriter.Close();
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                response = streamReader.ReadToEnd();
            }
        }
        return response;
    }


    private string PostWebService2(string url, string Post, string token)
    {
        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        string response = "";
        var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
        httpWebRequest.ContentType = "application/json";
        httpWebRequest.Method = "POST";
        httpWebRequest.Accept = "application/json";
        httpWebRequest.Headers.Add("api-key: " + wspathNetApiKey);
        
        using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
        {
            streamWriter.Write(Post);
            streamWriter.Flush();
            streamWriter.Close();
            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                response = streamReader.ReadToEnd();
            }
        }
        return response;
    }


    private string putWebService(string url, string json, string token)
    {

        string response = "";
		ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
        httpWebRequest.ContentType = "application/json";
        httpWebRequest.Method = "PUT";
		httpWebRequest.Headers.Add("api-key: " + wspathNetApiKey);
        httpWebRequest.Headers.Add("token: " + token);
		
        using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
        {

            streamWriter.Write(json);
            streamWriter.Flush();
            streamWriter.Close();

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                response = streamReader.ReadToEnd();
            }
        }

        return response;
    }
    private string deleteWebService(string url, string token)
    {
        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        WebRequest request = WebRequest.Create(url);
        request.Method = "DELETE";
        request.Headers.Add("api-key: " + wspathNetApiKey);
        request.Headers.Add("token: " + token);

        HttpWebResponse response = (HttpWebResponse)request.GetResponse();

        return response.ToString();
    }

    private string getWebService(string url)
    {
        string text = "";
		ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
        httpWebRequest.Method = WebRequestMethods.Http.Get;
        httpWebRequest.Accept = "application/json";
       
        var response = (HttpWebResponse)httpWebRequest.GetResponse();

        using (var sr = new StreamReader(response.GetResponseStream()))
        {
            text = sr.ReadToEnd();
        }

        return text;
    }


    private string getWebService(string url, string Post, string token)
    {

        string text = "";
        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
        httpWebRequest.Method = WebRequestMethods.Http.Get;
        httpWebRequest.Accept = "application/json";
        httpWebRequest.Headers.Add("api-key: " + wspathNetApiKey);
        httpWebRequest.Headers.Add("token: " + token);
        var response = (HttpWebResponse)httpWebRequest.GetResponse();

        using (var sr = new StreamReader(response.GetResponseStream()))
        {
            text = sr.ReadToEnd();
        }

        return text;


    }

    private string getWebServiceBearer(string url, string token)
    { 

        string text = "";
        ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
        httpWebRequest.Method = WebRequestMethods.Http.Get;
        httpWebRequest.Accept = "application/json";
        httpWebRequest.Headers.Add("Authorization: Bearer " + token);
        var response = (HttpWebResponse)httpWebRequest.GetResponse();

        using (var sr = new StreamReader(response.GetResponseStream()))
        {
            text = sr.ReadToEnd();
        }

        return text;


    }



    public string Base64Encode(string plainText)
    {
        var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
        return System.Convert.ToBase64String(plainTextBytes);
    }

    public string Base64Decode(string base64EncodedData)
    {
        var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
        return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
    }


}
