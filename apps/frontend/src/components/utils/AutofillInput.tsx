import React from "react";

const AutofillInput = () => {
  return (
    <div>
      <form>
        <input type={"text"} placeholder={"Start Location"} />
        <input type={"text"} placeholder={"Ending Location"} />
      </form>
    </div>
  );
};

export { AutofillInput };
