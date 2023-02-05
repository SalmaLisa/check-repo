import React, { Component } from "react";
import Table from "./../common/table";
import { Link, withRouter } from "react-router-dom";
import moment from "moment"

class CompaniesTable extends Component {
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		values: [],
	// 	};
	// }

	columns = [
		//   {path: '_id', label: 'Id'},
		{
			key: "checkbox",
			label: (
				<input
					type="check"
					style={{
						width: "15px",
						height: "15px",
						marginTop: "0.4rem",
						borderRadius: 0,
					}}
				/>
			),
			content: (company) => (
				<span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
					<input
						type="checkbox"
						style={{
							width: "15px",
							height: "15px",
							marginTop: "0.4rem",
							borderRadius: 0,
						}}
						onChange={this.props.handleCheckboxChange}
						value={company._id}
					/>
				</span>
			),
		},
		{
		  label: "Username",
		  path: "companies.username",
		  content: (user) => (
			<span className="icon-img sm-r-5">
			  <img
				style={{ width: "20px", height: "20px", borderRadius: "50%" }}
				src={user.companies.imageSrc}
				alt=""
			  />{" "}
			  {user.companies.username}
			</span>
		  ),
		},
		{label: 'email',   path: 'companies.email' } ,   
		{label: 'CompanyNo',   path: 'clinicSoloNo' } ,   
		{label: 'Company',   path: 'companyInfo.businessName' } ,       
		{label: 'Firstname',   path: 'companies.contactName.first' } ,   
		{label: 'initials',   path: 'companies.contactName.initials' } ,   	  
		{label: 'Lastname',   path: 'companies.contactName.last' } ,   	  
		{label: 'DOB',   path: 'companies.dateBirth',content:(user) =>(moment(user.companies.dateBirth).format("L"))} ,
		{label: 'gender',   path: 'companies.gender' } ,   	  
		{label: 'Address 1',   path: 'companies.Address.address1' } ,   
		{label: 'Address 2',   path: 'companies.Address.address2' } ,   
		{label: 'Address 3',   path: 'companies.Address.address3' } ,           
		{label: 'zip',   path: 'companies.Address.zip' } ,   	  
		{label: 'city',   path: 'companies.Address.city' } ,   	      
		{label: 'state',   path: 'companies.Address.state' } ,   	          
		{label: 'Country',   path: 'companies.Address.country' } ,   	  	  
		{label: 'website',   path: 'companies.website' } ,   
		{label: 'Linkedin',   path: 'companies.linkedin' } ,       
		{label: 'mobile',   path: 'companies.phones.mobile' } ,   	  
		{label: 'phone',   path: 'companies.phones.phone' } ,   	  
		{label: 'skype',   path: 'companies.phones.skype' } , 
		{label: 'IBAN',   path: 'bankInfo.IBAN' } ,   
		{label: 'Bank',   path: 'bankInfo.bank' } ,   
		{label: 'Branch Bank',   path: 'bankInfo.branchOfBank' } ,   
		//{label: 'subscription',   path: 'subscription' } ,   	  
	//	{label: 'subscriptionEndDate',   path: 'subscriptionEndDate' } ,   	  
		{label: 'ChamberCommerce No',   path: 'chamberCommerceNo' } ,   
		{label: 'TaxPayerNo',   path: 'taxPayerNo' } ,   
		{label: 'OrganizationA Name',   path: 'organizationAName' } ,   	          
		{label: 'OrganizationA Member No',   path: 'organizationAMemberNo' } ,   	  	  
		{label: 'OrganizationB Name',   path: 'organizationBName' } ,   	          
		{label: 'OrganizationB Member No',   path: 'organizationBMemberNo' } ,   	  	  
	];

	render() {
		//console.log(this.columns) ;
		const { users, onSort, sortColumn } = this.props;
		return (
			<Table
				columns={this.columns}
				sortColumn={sortColumn}
				onSort={onSort}
				data={users}
			/>
		);
	}
}

export default CompaniesTable;
