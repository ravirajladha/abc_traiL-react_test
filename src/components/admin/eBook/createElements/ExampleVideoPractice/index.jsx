import { AddFieldButton, DeleteFieldButton } from '@/components/common/form';
import React, { Fragment, useState } from 'react';

const ExampleVideoPractice = ({
    handleFileArrayChange,
  handleInputArrayChange,
}) => {
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
      <div className="col-lg-12">
        <div className="row">
          {inputArray.map((title, index) => (
            <Fragment key={index}>
              <div className="col-lg-4 mb-3">
                <div className="form-group">
                  <label className="mont-font fw-600 font-xsss">Gif File</label>
                  <input
                    type="file"
                    className="form-control-file border-size-md p-2 rounded-sm"
                    name="example_gif"
                    onChange={(e) => handleFileArrayChange(e, 'example_gif', index)}
                    accept=".gif"
                  />
                </div>
              </div>
              <div className="col-lg-4 mb-2">
                <label className="mont-font fw-600 font-xsss">
                  Description for practice
                </label>
                <textarea
                  className="form-control mb-0 p-3 h100 bg-greylight lh-16"
                  rows="5"
                  placeholder="Enter Description..."
                  spellCheck="false"
                  name="practice_description"
                  onChange={(e) =>
                    handleInputArrayChange(e, 'practice_description', index)
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

export default ExampleVideoPractice;
