import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  Panel,
  PanelHeader,
  PanelBody,
} from '../../components/panel/panel.jsx';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';
import { saveArea, getArea } from '../../services/areas';
import { method } from 'lodash';
import AreaOptions from './areaoptions';
import { areIntervalsOverlapping } from 'date-fns';
// import { saveArea, getArea } from './../../services/areas';
const Handle = Slider.Handle;

class Area extends Form {
  done;
  response;
  location = {
    coordinates: ['444444', '3333'],
  };
  constructor(props) {
    super(props);

    this.state = {
      maxDateDisabled: true,
      data: {
        name: '',
        description: '',
        floor: '',
        location: {
          coordinates: ['444444', '3333'],
        },
      },
      selectedFile: null,
      errors: {},
    };

    this.handleSlider = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <Tooltip
          prefixCls='rc-slider-tooltip'
          overlay={value}
          visible={dragging}
          placement='top'
          key={index}
        >
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async handleSubmit(event) {
    const AreaId = this.props.match.params.id;
    event.preventDefault();
    console.log('data', JSON.stringify(this.state.data));
    try {
      const Response = await saveArea(this.state.data);
      if (Response) {
        alert('Data Added Successfully');
        this.props.history.push('/ero/areas');
      }
    } catch (error) {
      if (error) {
        alert('There was an error', error);
      }
    }
  }
  async populateArea() {
    try {
      const AreaId = this.props.match.params.id;
      if (AreaId === 'new') return;
      const { data: Area } = await getArea(AreaId);
      this.setState({
        data: Area,
      });
      console.log('weldone', Area);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/error');
    }
  }

  async componentDidMount() {
    await this.populateArea();
  }

  schema = Joi.object({
    name: Joi.string(),
    descriptions: Joi.string(),
    floor: Joi.string(),
    coordinates: Joi.string(),
  });

  doSubmit = async (Area) => {
    try {
      await saveArea(this.state.data);
      this.props.history.push('/databases/Areas');
    } catch (ex) {
      if (ex.response) {
        const errors = { ...this.state.errors };
        const path = ex.response.data.split('"')[1];
        errors[path] = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  mapToViewModel(Area) {
    return {
      _id: Area._id,
      coordinates: Area.coordinates,
      name: Area.name,
      descriptions: Area.descriptions,
      floor: Area.floor,
    };
  }

  render() {
    const { errors } = this.state;
    return (
      <React.Fragment>
        <div>
          <ol className='breadcrumb float-xl-right'>
            <li className='breadcrumb-item'>
              <Link to='/form/plugins'>Home</Link>
            </li>
            <li className='breadcrumb-item'>
              <Link to='/ero/areas'>Areas</Link>
            </li>
            <li className='breadcrumb-item active'>Add Area</li>
          </ol>
          <h1 className='page-header'>
            Add Area <small>Area-registration-form</small>
          </h1>

          <div className='row'>
            <div className='col-xl-10'>
              <Panel>
                <PanelHeader>Add Area</PanelHeader>
                <PanelBody className='panel-form'>
                  <form
                    className='form-horizontal form-bordered'
                    onSubmit={this.handleSubmit}
                  >
                    {this.renderSelect('name', 'Name', AreaOptions.Name)}

                    {this.renderTextarea(
                      'description',
                      'description',
                      'Enter descriptions'
                    )}

                    {this.renderSelect('floor', 'Floor', AreaOptions.Floor)}

                    <div className='form-group row'>
                      <div className='col-lg-8'>
                        <button
                          type='submit'
                          disabled={this.validate()}
                          className='btn btn-primary width-65'
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

export default withRouter(Area);
