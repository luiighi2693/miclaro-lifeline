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
using Claro.Models;


public partial class proccess_procesos2 : System.Web.UI.Page
{

    // intarcia Serializado
    System.Web.Script.Serialization.JavaScriptSerializer json = new System.Web.Script.Serialization.JavaScriptSerializer();
    
    string wspathUSF = "http://wslife00042ws.claroinfo.com/Service/svc/1/";
    

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

        if (ejecutar == "loginAdMcapi")
        {
            loginAdMcapi(jo);
        }
        else if (ejecutar == "validareSSNAdMcapi")
        {
            validareSSNAdMcapi(jo);
        }
        else if (ejecutar == "addressValidationMcapi")
        {
            addressValidationMcapi(jo);
        }
            
        else if (ejecutar == "subscriberVerificationMcapi")
        {
            subscriberVerificationMcapi(jo);
        }
        else if (ejecutar == "UpdloadDocumentMcapi")
        {
            UpdloadDocumentMcapi(jo);
        }
        else if (ejecutar == "RetrieveDocumentMcapi")
        {
            RetrieveDocumentMcapi(jo);
        }
        else if (ejecutar == "DeleteDocumentMcapi")
        {
            DeleteDocumentMcapi(jo);
        }
        else if (ejecutar == "ChangeStatusDocumentMcapi")
        {
            ChangeStatusDocumentMcapi(jo);
        }
		else if (ejecutar == "CreateNewAccountMcapi")
        {
            CreateNewAccountMcapi(jo);
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
        string PostURL = wspathUSF + "LOGINAD.MCAPI";
       
        object resp = ToJson(PostWebService(PostURL, PostData));

        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void validareSSNAdMcapi(JObject jo)
    {
        string USER_ID = jo["USER_ID"].ToString();
		string CUSTOMER_SUFFIX = jo["CUSTOMER_SUFFIX"].ToString();
        string CUSTOMER_NAME = jo["CUSTOMER_NAME"].ToString();
        string CUSTOMER_MN = jo["CUSTOMER_MN"].ToString();
        string CUSTOMER_LAST = jo["CUSTOMER_LAST"].ToString();
        string CUSTOMER_SSN = jo["CUSTOMER_SSN"].ToString();
        string CUSTOMER_DOB = jo["CUSTOMER_DOB"].ToString();
        string GENDER = jo["GENDER"].ToString();
        string CUSTOMER_ID_TYPE = jo["CUSTOMER_ID_TYPE"].ToString();
        string ID_NUMBER = jo["ID_NUMBER"].ToString();
        string DTS_EXP = jo["DTS_EXP"].ToString();
       
		string PostData = "{\"USER_ID\":\"" + USER_ID + "\",\"CUSTOMER_SUFFIX\":\"" + CUSTOMER_SUFFIX + "\",\"CUSTOMER_NAME\":\"" + CUSTOMER_NAME + "\",\"CUSTOMER_MN\":\"" + CUSTOMER_MN + "\",\"CUSTOMER_LAST\":\"" + CUSTOMER_LAST + "\",\"CUSTOMER_SSN\":\"" + CUSTOMER_SSN + "\",\"CUSTOMER_DOB\":\"" + CUSTOMER_DOB + "\",\"GENDER\":\"" + GENDER + "\",\"CUSTOMER_ID_TYPE\":\"" + CUSTOMER_ID_TYPE + "\",\"ID_NUMBER\":\"" + ID_NUMBER + "\",\"DTS_EXP\":\"" + DTS_EXP + "\"}";
        string PostURL = wspathUSF + "VALIDATE_SSN.MCAPI";
       
        object resp = ToJson(PostWebService(PostURL, PostData));

        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void addressValidationMcapi(JObject jo)
    {
        string user_ID = jo["user_ID"].ToString();
        string case_ID = jo["case_ID"].ToString();
        string addresstype = jo["addresstype"].ToString();
        string address1 = jo["address1"].ToString();
        string address2 = jo["address2"].ToString();
        string city = jo["city"].ToString();
        string state = jo["state"].ToString();
        string zip = jo["zip"].ToString();
        string phone1 = jo["phone1"].ToString();
        string phone2 = jo["phone2"].ToString();
        string email = jo["email"].ToString();
        string contact_preference = jo["contact_preference"].ToString();
        string PostalAddress = jo["PostalAddress"].ToString();
        string PostalAddress1 = jo["PostalAddress1"].ToString();
        string PostalAddress2 = jo["PostalAddress2"].ToString();
        string PostalAddresscity = jo["PostalAddresscity"].ToString();
        string PostalAddressState = jo["PostalAddressState"].ToString();
        string PostalAddresszip = jo["PostalAddresszip"].ToString();


        string PostData = "{\"user_ID\":\"" + user_ID + "\",\"case_ID\":\"" + case_ID + "\",\"addresstype\":\"" + addresstype + "\",\"address1\":\"" + address1 + "\",\"address2\":\"" + address2 + "\",\"city\":\"" + city + "\",\"state\":\"" + state + "\",\"zip\":\"" + zip + "\",\"phone1\":\"" + phone1 + "\",\"phone2\":\"" + phone2 + "\",\"email\":\"" + email + "\",\"contact_preference\":\"" + contact_preference + "\",\"PostalAddress\":\"" + PostalAddress + "\",\"PostalAddress1\":\"" + PostalAddress1 + "\",\"PostalAddress2\":\"" + PostalAddress2 + "\",\"PostalAddresscity\":\"" + PostalAddresscity + "\",\"PostalAddressState\":\"" + PostalAddressState + "\",\"PostalAddresszip\":\"" + PostalAddresszip + "\"}";
        string PostURL = wspathUSF + "ADDRESSVALIDATION.MCAPI";

        object resp = ToJson(PostWebService(PostURL, PostData));

        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }


    public void subscriberVerificationMcapi(JObject jo)
    {
        string UserID = jo["UserID"].ToString();
        string caseID = jo["caseID"].ToString();
        string Lookup_Type = jo["Lookup_Type"].ToString();
        string response = jo["response"].ToString();
        
        string depent_sufijo;
        string depent_name;
        string depent_mn;
        string depent_last;
        string depent_dob;
        string depent_ssn;

        if (jo["depent_sufijo"] != null)
        {
             depent_sufijo = jo["depent_sufijo"].ToString();
        }
        else
        {
             depent_sufijo = "";
        }

        if (jo["depent_name"] != null)
        {
             depent_name = jo["depent_name"].ToString();
        }
        else {
             depent_name = "";
        }

        if (jo["depent_mn"] != null)
        {
             depent_mn = jo["depent_mn"].ToString();
        }
        else
        {
             depent_mn = "";
        }

        if (jo["depent_last"] != null)
        {
             depent_last = jo["depent_last"].ToString();
        }
        else
        {
             depent_last = "";
        }

        if (jo["depent_dob"] != null)
        {
             depent_dob = jo["depent_dob"].ToString();
        }
        else 
        {
             depent_dob = "";
        }

        if (jo["depent_ssn"] != null)
        {
             depent_ssn = jo["depent_ssn"].ToString();
        }
        else 
        {
             depent_ssn = "";
        }



        string PostData = "{\"UserID\":\"" + UserID + "\",\"caseID\":\"" + caseID + "\",\"Lookup_Type\":\"" + Lookup_Type + "\",\"response\":\"" + response + "\",\"depent_sufijo\":\"" + depent_sufijo + "\",\"depent_name\":\"" + depent_name + "\",\"depent_mn\":\"" + depent_mn + "\",\"depent_last\":\"" + depent_last + "\",\"depent_dob\":\"" + depent_dob + "\",\"depent_ssn\":\"" + depent_ssn + "\"}";
        string PostURL = wspathUSF + "SUBSCRIBER_VERIFICATION.MCAPI";

        object resp = ToJson(PostWebService(PostURL, PostData));

        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }


    //public void UpdloadDocumentMcapi(JObject jo)
    //{
    //    string documentTypeID = jo["documentTypeID"].ToString();
    //    string user_Id = jo["user_Id"].ToString();
    //    string case_number = jo["case_number"].ToString();
    //    string content = jo["content"].ToString();
    //    string fileType = jo["fileType"].ToString();

    //    string PostData = "{\"documentTypeID\":\"" + documentTypeID + "\",\"user_Id\":\"" + user_Id + "\",\"case_number\":\"" + case_number + "\",\"content\":\"" + content + "\",\"fileType\":\"" + fileType + "\"}";
    //    string PostURL = wspathUSF + "UpdloadDocument.MCAPI";

    //    object resp = ToJson(PostWebService(PostURL, PostData));



    //    Response.Clear();
    //    Response.ContentType = "application/json; charset=utf-8";
    //    Response.Write(json.Serialize(resp));
    //    Response.End();
    //}


    public void UpdloadDocumentMcapi(JObject jo)
    {

        int documentTypeID = Convert.ToInt32(jo["documentTypeID"].ToString());
        int user_Id = Convert.ToInt32(jo["user_Id"].ToString());
        int case_number = Convert.ToInt32(jo["case_number"].ToString());
        string content =jo["content"].ToString();
        string fileType = jo["fileType"].ToString();

        string PostData = "'" + documentTypeID + "','" + user_Id + "','" + case_number +"','" + content + "','" + fileType + "'";
        
        wsUSF.Clases.ClsUploadDocument objRespo = new wsUSF.Clases.ClsUploadDocument();
        wsUSF.Clases.ClsUploadbefore objResponse = new wsUSF.Clases.ClsUploadbefore();
        object objResp = objResponse.UploadDocumentbefore(documentTypeID, user_Id, case_number, content, fileType);


        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(objResp));
        Response.End();

    }

    public void RetrieveDocumentMcapi(JObject jo)
    {
        string documentTypeID = jo["documentTypeID"].ToString();


        string PostData = "{\"documentTypeID\":\"" + documentTypeID + "\"}";
        string PostURL = wspathUSF + "RetrieveDocument.MCAPI";

        object resp = ToJson(PostWebService(PostURL, PostData));

        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }


    public void DeleteDocumentMcapi(JObject jo)
    {
        string documentTypeID = jo["documentTypeID"].ToString();
        string user_Id = jo["user_Id"].ToString();
        string case_number = jo["case_number"].ToString();


        string PostData = "{\"documentTypeID\":\"" + documentTypeID + "\",\"user_Id\":\"" + user_Id + "\",\"case_number\":\"" + case_number + "\"}";
        string PostURL = wspathUSF + "DeleteDocument.MCAPI";

        object resp = ToJson(PostWebService(PostURL, PostData));

        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }

    public void ChangeStatusDocumentMcapi(JObject jo)
    {
        string documentTypeID = jo["documentTypeID"].ToString();
        string user_Id = jo["user_Id"].ToString();
        string case_number = jo["case_number"].ToString();


        string PostData = "{\"documentTypeID\":\"" + documentTypeID + "\",\"user_Id\":\"" + user_Id + "\",\"case_number\":\"" + case_number + "\"}";
        string PostURL = wspathUSF + "ChangeStatusDocument.MCAPI";

        object resp = ToJson(PostWebService(PostURL, PostData));

        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json.Serialize(resp));
        Response.End();
    }
	
	public void CreateNewAccountMcapi(JObject jo)
    {
        string mAccountType = jo["mAccountType"].ToString();
        string mAccountSubType = jo["mAccountSubType"].ToString();
        string UserID = jo["UserID"].ToString();
		string caseID = jo["caseID"].ToString();
		string customer_ssn = jo["customer_ssn"].ToString();
		string SIMSerial = jo["SIMSerial"].ToString();
		string IMEISerial = jo["IMEISerial"].ToString();
		string tech = jo["tech"].ToString();
		string mSocCode = jo["mSocCode"].ToString();
		
		          


        string PostData = "{\"mAccountType\":\"" + mAccountType + "\",\"mAccountSubType\":\"" + mAccountSubType + "\",\"UserID\":\"" + UserID + "\",\"caseID\":\"" + caseID + "\",\"customer_ssn\":\"" + customer_ssn + "\",\"SIMSerial\":\"" + SIMSerial + "\",\"IMEISerial\":\"" + IMEISerial + "\",\"tech\":\"" + tech + "\",\"mSocCode\":\"" + mSocCode + "\"}";
        string PostURL = wspathUSF + "CREATENEWACCOUNT.MCAPI";

        object resp = ToJson(PostWebService(PostURL, PostData));

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
  


   
    public object ToJson(string str)
    {

        System.Web.Script.Serialization.JavaScriptSerializer j = new System.Web.Script.Serialization.JavaScriptSerializer();
        object a = j.Deserialize(str, typeof(object));
        return a;
    }

    private string getWebService(string url)
    {
        string text = "";

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

    private string PostWebServiceUpd(string url, string html)
    {
        string response = "";
        if (url.ToLower().StartsWith("https"))
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072; //TLS 1.2
        }
        var httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
        httpWebRequest.ContentType = "text/html";
        httpWebRequest.Method = "POST";
        using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
        {
            streamWriter.Write(html);
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
