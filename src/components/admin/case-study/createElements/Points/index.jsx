import { AddFieldButton, DeleteFieldButton } from '@/components/common/form';
import React, { Fragment, useState } from 'react';

const Point = ({ handleInputChange, handleInputArrayChange }) => {
  const [inputArray, setInputArray] = useState(['']);

  const deleteSection = (index) => {
    const updatedInputArray = [...inputArray];
    updatedInputArray.splice(index, 1);
    setInputArray(updatedInputArray);
  };
  const addSection = () => {
    setInputArray([...inputArray, '']);
  };
  return (
    <>
      <div className="col-lg-4 mb-3">
        <div className="form-group">
          <label className="mont-font fw-600 font-xsss">List Type</label>
          <select
            className="form-control"
            name="list_type"
            id="list_type"
            onChange={(e) => handleInputChange(e, 'list_type')}
            required
          >
            <option value="" selected disabled readOnly>
              --select--
            </option>
            <option value="bullet">Bullet</option>
            <option value="check">Check</option>
            <option value="arrow">Arrow</option>
            <option value="star">Star</option>
            <option value="square">Square</option>
          </select>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="row">
          {inputArray.map((title, index) => (
            <Fragment key={index}>
              <div className="col-lg-6 mb-2">
                <label className="mont-font fw-600 font-xsss">Points</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Enter Points"
                  required
                  onChange={(e) =>
                    handleInputArrayChange(e, 'list_points', index)
                  }
                />
              </div>
              <DeleteFieldButton onClick={() => deleteSection(index)} />
            </Fragment>
          ))}
        </div>
        <AddFieldButton onClick={addSection} />
      </div>
    </>
  );
};

export default Point;
