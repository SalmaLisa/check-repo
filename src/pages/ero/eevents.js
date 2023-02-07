import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Panel,PanelHeader,PanelBody,} from "./../../components/panel/panel.jsx";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination";
import { paginate } from "../../utils/paginate";
import EeventsTable from "../../components/eeventsTable";
import SearchBox from "./../../common/searchBox";
import _ from "lodash";
import http from "./../../services/httpService";
import { apiUrl } from "./../../config/config.json";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Icons imports
import newIcon from "../../assets/Icons/new.svg";
import editIcon from "../../assets/Icons/edit.svg";
import trashIcon from "../../assets/Icons/trash.svg";
import csvIcon from "../../assets/Icons/csv.svg";
import xlsIcon from "../../assets/Icons/xls.svg";
import pdfIcon from "../../assets/Icons/pdf.svg";

class EeventsTableData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: "eevent", order: "asc" },
      searchQuery: "",
      checkedFields: [],
      errors: {},
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleMassDelete = this.handleMassDelete.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleMassCheckbox = this.handleMassCheckbox.bind(this);
  }

  async componentDidMount() {
    axios
      .get("https://backend.itransportindex.com/api/events")
      .then((res) => {
        const eevents = res.data.map((dat) => {
          let customItems = dat.article;
          customItems = customItems.split(";;");
          for (let i = 0; i < customItems.length; i++) {
            customItems[i] = customItems[i] + "<br/>";
          }
          dat.article = customItems.join("");
          return dat;
        });
        this.setState({ eevents: eevents });
      });
  }

  handleDelete = (user) => {
    const Eevents = this.state.eevents.filter(
      (el) => el._id !== user._id
    );
    this.setState({ events: Eevents });
  };

  handleMassDelete = (CheckedFields) => {
    let Eevent = this.state.eevents;
    const originalEevents = this.state.eevents;
    CheckedFields.map(async (EeventId) => {
      const updated = Eevent.filter(
        (Event) => Event._id !== EventId
      );
      Eevent = updated;
      try {
        await http.delete(apiUrl + "/eevents/" + EeventId);
      } catch (ex) {
        if (ex.response && ex.response === 404) {
          alert("already deleted");
        }
        this.setState({ Eevents: originalEevents });
      }
      return Eevent;
    });
    this.setState({ eevents: Eevent });
  };

  //check box change
  handleCheckboxChange = ({ target: { checked, value } }) => {
    if (checked) {
      const checkedFields = [...this.state.checkedFields, value];
      this.setState({ checkedFields });
    } else {
      const checkedFields = [...this.state.checkedFields];
      this.setState({
        checkedFields: checkedFields.filter((e) => e !== value),
      });
    }
  };

  handleMassCheckbox = ({ target: { checked, value } }) => {
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let checkedFields = [];
    for (var i = 1; i < checkboxes.length; i++) {
      if (checkboxes[i] != value) checkboxes[i].checked = checked;
      checkedFields = [...checkedFields, checkboxes[i].value];
    }
    this.setState({ checkedFields: checkedFields });
  };

  //sorting columns
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  getDataPgnation = () => {
    const { pageSize, currentPage, eevents, sortColumn, searchQuery } =
      this.state;
      
    //filter maybe next time
    let filtered = eevents;
    if (searchQuery) {
      filtered = events.filter(
        (el) =>
          el.article.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const Eevents = paginate(sorted, currentPage, pageSize);
    return { data: Eevents };
  };

  render() {
    const { length: count } = this.state.eevents;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    // if(count === 0)  return "<p>No data available</p>";

    const { data: Eevents } = this.getDataPgnation();

    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
        </ol>
        <h1 className="page-header">Eevents </h1>
        <Panel>
          <PanelHeader>Eevents Management</PanelHeader>

          <React.Fragment>
            <ToastContainer />
            <div className="toolbar" style={toolbarStyles}>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                termofuse="add Eevent"
                style={btnStyles}
              >
                {" "}
                <Link to="/ero/eevents/new">
                  <img style={iconStyles} src={newIcon} />
                </Link>
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                eevent="edit Eevent"
                style={btnStyles}
              >
                {" "}
                <Link
                  to={
                    this.state.checkedFields
                      ? `/ero/eevents/${this.state.checkedFields[0]}`
                      : "/ero/eevents/"
                  }
                >
                  <img style={iconStyles} src={editIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                termofuse="delete Eevent"
                style={btnStyles}
                onClick={() => this.handleMassDelete(this.state.checkedFields)}
              >
                {" "}
                <img
                  style={{ width: "25px", height: "25px" }}
                  src={trashIcon}
                />
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                termofuse="Excel"
                style={btnStyles}
              >
                {" "}
                <Link to="/ero/eevents/">
                  <img style={iconStyles} src={xlsIcon} />
                </Link>{" "}
              </button>

              <button
                className="btn btn-default active m-r-5 m-b-5"
                termofuse="csv"
                style={btnStyles}
              >
                {" "}
                <Link to="/ero/eevents/">
                  <img style={iconStyles} src={csvIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                termofuse="PDF"
                style={btnStyles}
              >
                {" "}
                <Link to="/ero/eevents/">
                  <img style={iconStyles} src={pdfIcon} />
                </Link>{" "}
              </button>
              <button
                className="btn btn-default active m-r-5 m-b-5"
                termofuse="Share to other"
                style={btnStyles}
              >
                {" "}
                <Link to="/ero/eevents/">
                  <img style={iconStyles} src={sharingIcon} />
                </Link>{" "}
              </button>
            </div>
            <div className="table-responsive">
              <SearchBox value={searchQuery} onChange={this.handleSearch} />
              <p
                className="page-header float-xl-left"
                style={
                  ({ marginBottom: 5 }, { marginLeft: 20 }, { marginTop: 5 })
                }
              >
                {count} entries
              </p>

              <EventsTable
                Events={Events}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
                toggle={this.handleMassCheckbox}
              />
            </div>
          </React.Fragment>

          <hr className="m-0" />
          <PanelBody>
            <div className="d-flex align-items-center justify-content-center">
              <Pagination
                itemsCount={count}
                pageSize={pageSize}
                onPageChange={this.handlePageChange}
                currentPage={currentPage}
              />
            </div>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}
const toolbarStyles = {
  background: "#c8e9f3",
  padding: "10px",
};

const btnStyles = { background: "#348fe2", margin: "0rem" };

const iconStyles = {
  width: "25px",
  height: "25px",
  marginRight: "0rem",
};

export default EeventsTableData;
