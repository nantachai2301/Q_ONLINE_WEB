import React, { Fragment /*, useState*/ } from 'react';
import Image from '../assets/image/Image.png';

export const DropzoneImage = ({ title = '', value = '', onChange, name = '', multiple = false, errors = false, touched = false }) => {
  // const [hidImg, setHidImg] = useState(true);

  var items = [];
  value.map((value, index) => items.push(<img className="mx-auto h-32 w-full px-1" src={Object.keys(value).length !== 0 ? value : URL.createObjectURL(value)} alt="" key={index} />));

  return (
    <Fragment>
      <label className={`cursor-pointer d-flex justify-content-center px-6 py-4 border border-2 border-secondary rounded ${errors && touched ? 'border-danger' : ''}`}>
        <div className="w-full d-flex items-center justify-content-center">
          <div className="w-full">
            {value.length > 0 && !multiple ? (
              <div className="row d-flex justify-content-center">
                {value.map((img, keyind) => (
                  <img className="col-6" src={Object.keys(img).length !== 0 ? img : URL.createObjectURL(img)} alt="" key={keyind} />
                ))}
              </div>
            ) : (
              <div className="row d-flex justify-content-center">
                <img className="col-6" src={Image} alt="" />
              </div>
            )}
            <p className="text-center fs-6 mt-3">{title}</p>
            <p className="text-center content-dropzone">PNG, JPG, JPEG ขนาดไม่เกิน 10MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            name={name}
            multiple={multiple}
            accept="image/*"
            onChange={(e) => {
              onChange(e);
              e.target.value = null;
            }}
          />
        </div>
      </label>
      {errors && touched ? <div className="mt-1 text-red-500 text-xs">{errors}</div> : null}
    </Fragment>
  );
};
