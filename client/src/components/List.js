import React from "react";
import PropTypes from "prop-types";

function List({ headers, data, uniqueKey }) {
  return (
    <div className="table-container">
      {data && data.length > 0 ? (
        <table className="dynamic-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item[uniqueKey]}>
                {headers.map((header, index) => (
                  <td key={index}>{item[header.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
}

List.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // Header name
      key: PropTypes.string.isRequired, // Corresponding key in data
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  uniqueKey: PropTypes.string.isRequired,
};

export default List;
