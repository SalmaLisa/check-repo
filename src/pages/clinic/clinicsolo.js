import React from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "../../components/panel/panel.jsx";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import ReactTags from "react-tag-autocomplete";
import DatePicker from "react-datepicker";
import DateTime from "react-datetime";
import moment from "moment";
//import Select from 'react-select';
//import Select from "../../common/select";
import CountryDropDown from "../../components/user/CountryDropDown";
import GenderDropDown from "../../components/user/GenderDropDown";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "react-datetime/css/react-datetime.css";
import "react-datepicker/dist/react-datepicker.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import { apiUrl } from "../../config/config.json";
import http from "../../services/httpService";
import { saveClinic, getClinic } from "./../../services/clinics";
import PhoneInput from "react-phone-input-2";
import { getCode } from "country-list";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class ClinicSolo extends Form {
  constructor(props) {
    super(props);

    var maxYesterday = "";
    var minYesterday = DateTime.moment().subtract(1, "day");

    this.minDateRange = (current) => {
      return current.isAfter(minYesterday);
    };
    this.maxDateRange = (current) => {
      return current.isAfter(maxYesterday);
    };
    this.minDateChange = (value) => {
      this.setState({
        maxDateDisabled: false,
      });
      maxYesterday = value;
    };

    this.state = {
      maxDateDisabled: true,
      countries: [],
      profiles: [],
      data: {
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        initials: "",
        address1: "",
        address2: "",
        address3: "",
        zip: "",
        city: "",
        state: "",
        country: "",
        longitude: "-80.1347334",
        latitude: "25.7663562",
        dateBirth: new Date(),
        gender: "",
        imageSrc: null,
        prefix: "",
        phone: "",
        mobile: "",
        skype: "",
        IBAN: "",
        bank: "",
        branchOfBank: "",
        subscription: "",
        subscriptionStartDate: new Date(),
        subscriptionPeriod: "",						
        businessName: "",
        chamberCommerceNo: "",
        taxPayerNo: "",
        website: "",
        size: "",
        industry: "",
        healthcareProviderIdentifierOrganisation: "",
        healthcareProviderIdentifierIndividual: "",
        treatments: "",
        licenseNo: "",
        licenseValidTill: "",
        organizationAName: "",
        organizationAMemberNo: "",
        organizationBName: "",
        organizationBMemberNo: "",
        status: "",
      },
      selectedFile: null,
      errors: {},
    };

    this.prefixOptions = [
      { value: "Mr", label: "Mr." },
      { value: "Mrs", label: "Mrs." },
      { value: "Mss", label: "Mss." },
      { value: "Ms", label: "Ms." },
      { value: "Prof", label: "Prof." },
      { value: "Dr", label: "Dr." },
    ];

    this.genderOptions = [
      { value: "Female", label: "Female" },
      { value: "Male", label: "Male" },
      { value: "Other", label: "Other" },
    ];

    this.subscriptionOptions = [
      { value: "clinic", label: "Clinic" },
      { value: "solo", label: "Solo" },
    ];

    this.statusOptions = [
      { value: "active", label: "Active" },
      { value: "banned", label: "Banned" },
      { value: "deleted", label: "Deleted" },
      { value: "inactive", label: "Inactive" },
      { value: "archived", label: "Archived" },
    ];

    this.handleSlider = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <Tooltip
          prefixCls="rc-slider-tooltip"
          overlay={value}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
  }

  async populateCountries() {
    const { data: countries } = await http.get(apiUrl + "/countries");
    this.setState({ countries: countries });
    //this.selectCountries = this.state.countries.map((country)=>({label: country.name, value: country.name}) );
    this.selectCountries = this.state.countries.map((country) => ({
      _id: country._id,
      label: country.name,
      value: country.name,
    }));
  }

  async populateGenders() {
    this.genderoptions = this.genderOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }
  async populatePrefix() {
    this.prefixoptions = this.prefixOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }
  async populateStatus() {
    this.statusoptions = this.statusOptions.map((option) => (
      <option key={option.label} value={option.value}>
        {option.value}
      </option>
    ));
  }

  async populateUser() {
    try {
      const userId = this.props.match.params.id;

      if (userId === "new") return;

      const { data: user } = await getClinic(userId);
      //console.log(user[0]);
      //const clinic = Object.assign({},user[0]);
      const clinic = user[0];
      //console.log(clinic);
      if (!clinic.dateBirth) clinic.dateBirth = new Date();

      clinic.firstName = clinic.contactName.first;
      clinic.lastName = clinic.contactName.last;
      clinic.initials = clinic.contactName.initials;
      clinic.IBAN = clinic.bankInfo.IBAN;
      clinic.bank = clinic.bankInfo.bank;
      clinic.branchOfBank = clinic.bankInfo.branchOfBank;
      clinic.subscription = clinic.subscription.subscription;
      clinic.subscriptionStartDate = clinic.subscription.subscriptionStartDate;
      clinic.subscriptionPeriod = clinic.subscription.subscriptionPeriod;	  
      clinic.businessName = clinic.companyInfo.businessName;
      clinic.chamberCommerceNo = clinic.companyInfo.chamberCommerceNo;
      clinic.taxPayerNo = clinic.companyInfo.taxPayerNo;
      clinic.website = clinic.companyInfo.website;
      clinic.size = clinic.companyInfo.size;
      clinic.industry = clinic.companyInfo.industry;
      clinic.healthcareProviderIdentifierOrganisation =
      clinic.professionalInfo.healthcareProviderIdentifierOrganisation;
      clinic.healthcareProviderIdentifierIndividual =
      clinic.professionalInfo.healthcareProviderIdentifierIndividual;
      clinic.treatments = clinic.professionalInfo.treatments;
      clinic.licenseNo = clinic.professionalInfo.licenseNo;
      clinic.licenseValidTill = clinic.professionalInfo.licenseValidTill;
      clinic.organizationAName = clinic.membership.organizationAName;
      clinic.organizationAMemberNo = clinic.membership.organizationAMemberNo;
      clinic.organizationBName = clinic.membership.organizationBName;
      clinic.organizationBMemberNo = clinic.membership.organizationBMemberNo;
      clinic.longitude = clinic.companyInfo.location.coordinates[0];
      clinic.latitude = clinic.companyInfo.location.coordinates[1];
      //  delete clinic.password;

      this.setState({ data: this.mapToViewModel(clinic) });
      console.log(clinic);
      //console.log(this.state.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/error");
    }
  }

  async componentDidMount() {
    //await this.populateProfiles();
    await this.populatePrefix();
    await this.populateCountries();
    await this.populateGenders();
    await this.populateSubscriptions();	
    await this.populateStatus();
    await this.populateUser();
  }

  schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    firstName: Joi.string(),
    lastName: Joi.string(),
    initials: Joi.any().optional(),
    gender: Joi.string().optional(),
    prefix: Joi.any().optional(),
    address1: Joi.any().optional(),
    address2: Joi.any().optional(),
    address3: Joi.any().optional(),
    zip: Joi.any().optional(),
    city: Joi.any().optional(),
    state: Joi.any().optional(),
    country: Joi.any().optional(),
    phone: Joi.any().optional(),
    mobile: Joi.any().optional(),
    skype: Joi.any().optional(),
    //profile: Joi.any().required(),
    dateBirth: Joi.date().optional(),
    // email: Joi.string()
    // 	.email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    email: Joi.string().email({ tlds: { allow: false } }),
    IBAN: Joi.any().optional(),
    bank: Joi.any().optional(),
    branchOfBank: Joi.any().optional(),
    subscription: Joi.string().required(),
    subscriptionStartDate: Joi.any().optional(),
    businessName: Joi.any().required(),
    website: Joi.any().optional(),
    size: Joi.any().optional(),
    industry: Joi.any().optional(),
    healthcareProviderIdentifierOrganisation: Joi.any().optional(),
    healthcareProviderIdentifierIndividual: Joi.any().optional(),
    chamberCommerceNo: Joi.any().optional(),
    taxPayerNo: Joi.any().optional(),
    treatments: Joi.any().optional(),
    licenseNo: Joi.any().optional(),
    licenseValidTill: Joi.any().optional(),
    organizationAName: Joi.any().optional(),
    organizationAMemberNo: Joi.any().optional(),
    organizationBName: Joi.any().optional(),
    organizationBMemberNo: Joi.any().optional(),
    longitude: Joi.any().optional(),
    latitude: Joi.any().optional(),
    subscription: Joi.any().required(),	
    subscriptionStartDate: Joi.any().required(),		
    subscriptionPeriod: Joi.any().optional(),			
  });

  handleDobChange = (e) => {
    const errors = { ...this.state.errors };
    const obj = { ["dateBirth"]: e };

    const data = { ...this.state.data };
    data["dateBirth"] = e;
    //const data = {...this.state.data};
    //data.dateBirth = e;
    this.setState({ data });
    console.log(this.state.data);
  };

  onChangeImgHandler = (event) => {
    this.setState({ imageSrc: event.target.files[0] });
    console.log(event.target.files[0]);
  };

  doSubmit = async (user) => {
    //console.log('working');
    try {
      console.log(this.state.data);
      await saveClinic(this.state.data, this.state.imageSrc);
      //console.log(this.state.data);
      this.props.history.push("/clinic/clinicsolos");
    } catch (ex) {
      //if(ex.response && ex.response.status === 404){
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
        //console.log(this.state.errors);
      }
    }
  };

  mapToViewModel(user) {
    return {
      _id: user._id,
      username: user.username,
      password: user.password,
      //profile: user.profile,
      email: user.email,
      dateBirth: new Date(user.dateBirth),
      firstName: user.firstName,
      lastName: user.lastName,
      initials: user.initials,
      prefix: user.prefix,
      address1: user.address1,
      address2: user.address2,
      address3: user.address3,
      city: user.city,
      state: user.state,
      zip: user.zip,
      country: user.country,
      phone: user.phone,
      mobile: user.mobile,
      skype: user.skype,
      gender: user.gender,
      imageSrc: user.imageSrc,
      status: user.status,
      IBAN: user.IBAN,
      bank: user.bank,
      branchOfBank: user.branchOfBank,
      subscription: user.subscription,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionPeriod: user.subscriptionPeriod,	  
      website: user.website,
      size: user.size,
      industry: user.industry,
      businessName: user.businessName,
      healthcareProviderIdentifierOrganisation:
      user.healthcareProviderIdentifierOrganisation,
      healthcareProviderIdentifierIndividual:
      user.healthcareProviderIdentifierIndividual,
      chamberCommerceNo: user.chamberCommerceNo,
      taxPayerNo: user.taxPayerNo,
      treatments: user.treatments,
      licenseNo: user.licenseNo,
      licenseValidTill: user.licenseValidTill,
      organizationAName: user.organizationAName,
      organizationAMemberNo: user.organizationAMemberNo,
      organizationBName: user.organizationBName,
      organizationBMemberNo: user.organizationBMemberNo,
      longitude: user.longitude,
      latitude: user.latitude,
    };
  }

  render() {
    const { data, errors } = this.state;
    console.log(data);
    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/form/plugins">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/clinic/clinicsolos">Clinics</Link>
            </li>
            <li className="breadcrumb-item active">Add Clinic</li>
          </ol>
          <h1 className="page-header">
            Add Clinic-Solo <small>Clinic-Solo-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add Clinic</PanelHeader>
                <PanelBody className="panel-form">
                  <form
                    className="form-horizontal form-bordered"
                    onSubmit={this.handleSubmit}
                  >
                    {this.renderInput(
                      "businessName",
                      "business Name",
                      "text",
                      "Enter Business-Name"
                    )}

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label">
                        Subscription Type
                      </label>

                      <div className="btn-group col-lg-8">
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            name="subscription"
                            id="customRadioInline1"
                            className="custom-control-input"
                            onChange={this.handleChange}
                            value="Clinic"
                            checked={data.subscription === "Clinic"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customRadioInline1"
                          >
                            {" "}
                            Clinic
                          </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            name="subscription"
                            id="customRadioInline2"
                            className="custom-control-input"
                            onChange={this.handleChange}
                            value="Solo"
                            checked={data.subscription === "Solo"}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customRadioInline2"
                          >
                            {" "}
                            SoloPractice
                          </label>
                        </div>
                      </div>
                      {errors.subscription && (
                        <div className="alert alert-danger">
                          {errors.subscription}
                        </div>
                      )}
                    </div>

                    {/* <FormControl component="fieldset">
      <FormLabel component="legend">Subscription Type</FormLabel>
  
      <RadioGroup row aria-label="position" name="subscription" defaultValue="top">
        <FormControlLabel
          value="Solo"
          control={<Radio color="primary" />}
          label="SoloPractice"
          labelPlacement="center" onChange={this.handleChange} value="Solo" checked={data.subscription === "Solo" }
        />
    
        <FormControlLabel value="Clinic" control={<Radio color="primary" />} label="Clinic" labelPlacement="center" onChange={this.handleChange} value="Clinic"  checked={data.subscription === "Clinic" }  />
      </RadioGroup>




	  {errors.subscription && (<div className="alert alert-danger">{errors.subscription}</div>)}
    </FormControl> */}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="prefix"
                      >
                        Prefix
                      </label>
                      <div className="col-lg-8">
                        <select
                          name="prefix"
                          id="prefix"
                          value={data.prefix}
                          onChange={this.handleChange}
                          className="form-control"
                        >
                          <option value="">Select Prefix</option>
                          {this.prefixoptions}
                        </select>
                      </div>
                      {errors.prefix && (
                        <div className="alert alert-danger">
                          {errors.prefix}
                        </div>
                      )}
                    </div>

                    {this.renderInput(
                      "firstName",
                      "First Name",
                      "text",
                      "* Enter Firstname"
                    )}
                    {this.renderInput(
                      "initials",
                      "Initials",
                      "text",
                      "Enter Initials"
                    )}
                    {this.renderInput(
                      "lastName",
                      "Last Name",
                      "text",
                      "* Enter Lastname"
                    )}

                    {this.renderInput(
                      "address1",
                      "Address 1",
                      "text",
                      "Enter address1"
                    )}
                    {this.renderInput(
                      "address2",
                      "Address 2",
                      "text",
                      "Enter address2"
                    )}
                    {this.renderInput(
                      "address3",
                      "Address 3",
                      "text",
                      "Enter address3"
                    )}
                    {this.renderInput("city", "City", "text", "Enter City")}
                    {this.renderInput("state", "State", "text", "Enter State")}
                    {this.renderInput(
                      "zip",
                      "Zip code",
                      "text",
                      "Enter zipcode"
                    )}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="country"
                      >
                        Country
                      </label>
                      <div className="col-lg-8">
                        <CountryDropDown
                          placeholder="country"
                          changeHandler={(e) => {
                            const data = { ...this.state.data };
                            data["country"] = e;
                            this.setState({ data });
                          }}
                          selectedValue={
                            this.state.data.country
                              ? this.state.data.country
                              : "Netherlands"
                          }
                          name="country"
                        />
                      </div>
                      {errors.country && (
                        <div className="alert alert-danger">
                          {errors.country}
                        </div>
                      )}
                    </div>
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="phone"
                      >
                        Phone
                      </label>
                      <div className="col-lg-8">
                        <PhoneInput
                          inputStyle={{
                            width: "100%",
                            height: "5px",
                          }}
                          country={
                            getCode(this.state.data.country)?.toLowerCase() ||
                            "nl"
                          }
                          value={
                            this.state.data.phone ? this.state.data.phone : ""
                          }
                          onChange={(_Phone) => {
                            const data = { ...this.state.data };
                            data["phone"] = _Phone;
                            this.setState({ data });
                          }}
                        />
                      </div>
                      {errors.phone && (
                        <div className="alert alert-danger">{errors.phone}</div>
                      )}
                    </div>
                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="mobile"
                      >
                        Mobile
                      </label>
                      <div className="col-lg-8">
                        <PhoneInput
                          inputStyle={{
                            width: "100%",
                          }}
                          country={
                            getCode(this.state.data.country)?.toLowerCase() ||
                            "nl"
                          }
                          value={
                            this.state.data.mobile ? this.state.data.mobile : ""
                          }
                          onChange={(_Phone) => {
                            const data = { ...this.state.data };
                            data["mobile"] = _Phone;
                            this.setState({ data });
                          }}
                        />
                      </div>
                      {errors.mobile && (
                        <div className="alert alert-danger">
                          {errors.mobile}
                        </div>
                      )}
                    </div>

                    {this.renderInput("skype", "Skype", "text", "Enter skype")}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="gender"
                      >
                        Gender
                      </label>
                      <div className="col-lg-8">
                        <select
                          name="gender"
                          id="gender"
                          value={data.gender}
                          onChange={this.handleChange}
                          className="form-control"
                        >
                          <option value="">Select Gender</option>
                          {this.genderoptions}
                        </select>
                      </div>
                      {errors.gender && (
                        <div className="alert alert-danger">
                          {errors.gender}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="dateBirth">
                        Date of Birth
                      </label>
                      <div className="col-lg-8">
                        <DatePicker
                          onChange={this.handleDobChange}
                          id={data.dateBirth}
                          value={data.dateBirth}
                          selected={data.dateBirth}
                          inputProps={{ placeholder: "Datepicker" }}
                          className="form-control"
                        />
                        {errors.dateBirth && (
                          <div className="alert alert-danger">
                            {errors.dateBirth}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="username"
                      >
                        UserName
                      </label>
                      <div className="col-lg-8">
                        <div className="row row-space-10">
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={data.username}
                            className="form-control m-b-5"
                            placeholder="Enter username"
                            onChange={this.handleChange}
                            autoFocus
                          />
                          {errors.username && (
                            <div className="alert alert-danger">
                              {errors.username}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {this.renderInput("email", "Email", "email", "Enter email")}
                    {this.renderInput(
                      "password",
                      "Password",
                      "password",
                      "Enter Password"
                    )}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="imageSrc"
                      >
                        Logo
                      </label>
                      <div className="col-lg-8">
                        <div className="row row-space-10">
                          <input
                            type="file"
                            id="imageSrc"
                            name="imageSrc"
                            className="form-control-file m-b-5"
                            onChange={this.onChangeImgHandler}
                          />
                          <img
                            src={data.imageSrc}
                            alt=""
                            className="media-object"
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                            }}
                          />
                          {errors.imageSrc && (
                            <div className="alert alert-danger">
                              {errors.imageSrc}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="subscription">
                        Subscription
                      </label>
                      <div className="col-lg-8">
                        <select name="subscription" id="subscription" value={data.subscription} 
                          onChange={this.handleChange} className="form-control" >
                          <option value="">Select subscription</option>
                          {this.subscriptionoptions}
                        </select>
                      </div>
                      {errors.gender && (
                        <div className="alert alert-danger">
                          {errors.subscription}
                        </div>
                      )}

                    <div className="form-group row">
                      <label className="col-lg-4 col-form-label" htmlFor="subscriptionStartDate">
                        Startdate of subscription
                      </label>
                      <div className="col-lg-8">
                        <DatePicker
                          onChange={this.handlesubscriptionStartDateChange}
                          id={data.subscriptionStartDate}
                          value={data.subscriptionStartDate}
                          selected={data.subscriptionStartDate}
                          inputProps={{ placeholder: "Datepicker" }}
                          className="form-control"
                        />
                        {errors.subscriptionStartDate && (
                          <div className="alert alert-danger">
                            {errors.subscriptionStartDate}
                          </div>
                        )}
                      </div>
                    </div>
                    </div>

                    {this.renderInput(
                      "longitude",
                      "Longitude",
                      "text",
                      "Enter longitude"
                    )}
                    {this.renderInput(
                      "latitude",
                      "Latitude",
                      "text",
                      "Enter latitude"
                    )}
                    {this.renderInput("bank", "Bank", "text", "Enter Bank")}
                    {this.renderInput(
                      "branchOfBank",
                      "branch Of Bank",
                      "text",
                      "Enter branchOfBank"
                    )}
                    {this.renderInput("IBAN", "IBAN", "text", "Enter IBAN")}
                    {this.renderInput(
                      "chamberCommerceNo",
                      "Chamber Commerce No",
                      "text",
                      "Enter chamberCommerceNo"
                    )}
                    {this.renderInput(
                      "taxPayerNo",
                      "Tax Payer No",
                      "text",
                      "Enter taxPayerNo"
                    )}
                    {this.renderInput(
                      "website",
                      "Website",
                      "text",
                      "Enter website"
                    )}
                    {this.renderInput(
                      "industry",
                      "Industry",
                      "text",
                      "Enter industry/branch"
                    )}
                    {this.renderInput("size", "Size", "text", "Enter size")}
                    {this.renderInput(
                      "healthcareProviderIdentifierOrganisation",
                      "Healthcare Provider Identifier Organisation",
                      "text",
                      "Enter healthcareProviderIdentifierOrganisation"
                    )}
                    {this.renderInput(
                      "healthcareProviderIdentifierIndividual",
                      "Healthcare Provider Identifier Individual",
                      "text",
                      "Enter healthcareProviderIdentifierIndividual"
                    )}
                    {this.renderInput(
                      "treatments",
                      "Treatments",
                      "text",
                      "Enter treatments"
                    )}
                    {this.renderInput(
                      "licenseNo",
                      "License No",
                      "text",
                      "Enter licenseNo"
                    )}
                    {this.renderInput(
                      "licenseValidTill",
                      "License Valid Till",
                      "text",
                      "Enter licenseValidTill"
                    )}
                    {this.renderInput(
                      "organizationAName",
                      "OrganizationA Name",
                      "text",
                      "Enter organizationAName"
                    )}
                    {this.renderInput(
                      "organizationAMemberNo",
                      "OrganizationA Member No",
                      "text",
                      "Enter organizationAMemberNo"
                    )}
                    {this.renderInput(
                      "organizationBName",
                      "OrganizationB Name",
                      "text",
                      "Enter organizationBName"
                    )}
                    {this.renderInput(
                      "organizationBMemberNo",
                      "OrganizationB MemberNo",
                      "text",
                      "Enter organizationBMemberNo"
                    )}

                    <div className="form-group row">
                      <label
                        className="col-lg-4 col-form-label"
                        htmlFor="status"
                      >
                        Select Status
                      </label>
                      <div className="col-lg-8">
                        <select
                          name="status"
                          id="status"
                          value={data.status}
                          onChange={this.handleChange}
                          className="form-control"
                        >
                          <option value="">Select Status</option>
                          {this.statusoptions}
                        </select>
                      </div>
                      {errors.status && (
                        <div className="alert alert-danger">
                          {errors.status}
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-8">
                        <button
                          type="submit"
                          disabled={this.validate()}
                          className="btn btn-primary width-65"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(ClinicSolo);