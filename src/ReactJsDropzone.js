import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types'

export default class ReactJsDropzone extends Dropzone {
  static findObjectByKey(array, key, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return i;
      }
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.handleRemoveDoc = this.handleRemoveDoc.bind(this);
    this.state = {
      files: this.props.files,
      style: this.props.style,
      name: this.props.name,
      showDrop: true,
    };
  }

  componentWillUnmount() {
    this.setState({ showDrop: false });
  }

  handleRemoveDoc(e, name) {
    e.preventDefault();
    const files = this.state.files;
    const delFile = this.findObjectByKey(this.state.files, 'name', name);
    files.splice(delFile, 1);
    this.setState({ files });
    this.props.setDocument(files);
  }

  merge(a, b, prop) {
    const reduced = a.filter(aitem => ! b.find(bitem => aitem[prop] === bitem[prop]));
    return reduced.concat(b);
  }

  onDrop(files) {
    this.state.files = this.merge(this.state.files, files, 'name');
    this.props.setDocument(this.state.files);
  }

  render() {
    const files = this.state.files.map((s) => {
      let imeg = '';
      const type = s.name.split('.').pop();
      if (type === 'zip') {
        imeg = `url(${this.props.image_zip})`;
      } else if (type === 'pdf') {
        imeg = `url(${this.props.image_pdf})`;
      } else if (type === 'doc' || type === 'docx') {
        imeg = `url(${this.props.image_doc})`;
      } else {
        imeg = `url(${this.props.image_def})`;
      }
      const style_div = {
        backgroundImage: imeg,
      };
      return (<div id={s.name} style={[style_div, this.props.element_style_main_div]} className='pull-left' key={s.name}>
        <div style={this.props.element_style_div} className={this.props.element_class_div}></div>
        <span style={this.props.element_style_span}>{s.name}</span>
        <span style={this.props.element_style_remove_span} onClick={(e) => this.handleRemoveDoc(e, s.name)}> </span>
        <div className='clearfix'></div>
      </div>);
    });
    return (
      <div className='form-group'>
        <label htmlFor='doc-proposal' className='label-form-upload-proposal'>Allegati</label>
        {this.state.showDrop && <Dropzone
          className='drag-upload-proposal'
          onDrop={this.onDrop}
          style={this.props.emptyStyle}
          name='document[]'
          accept='image/*,.pdf,.doc,.docx,.zip'
        >
          <p>{this.props.text}</p>
        </Dropzone>}
        <div className='clearfix'></div>
        <div id='input-file-for-progect'>
          {files}
        </div>
        <div className='clearfix'></div>
      </div>
    );
  }
}

ReactJsDropzone.propTypes = {
  style: PropTypes.object,
  emptyStyle: PropTypes.object,
  element_style_main_div: PropTypes.object,
  element_style_span: PropTypes.object,
  element_style_remove_span: PropTypes.object,
  element_style_div: PropTypes.object,
  element_class_div: PropTypes.string,
  image_doc: PropTypes.string,
  image_zip: PropTypes.string,
  image_pdf: PropTypes.string,
  image_def: PropTypes.string,
  files: PropTypes.array,
  setDocument: PropTypes.function,
}

ReactJsDropzone.defaultProps = {
  style: {
    marginTop: '20px',
    marginRight: '20px',
  },
  emptyStyle: {
    backgroundImage: 'none',
  },
  element_style_main_div: {
    height: '50px',
    width: '50px',
    float: 'left',
  },
  element_style_span: {
    float: 'left',
    margin: '12px',
  },
  element_style_remove_span: PropTypes.object,
  element_style_div: PropTypes.object,
  element_class_div: 'class-div',
  files: [],
}