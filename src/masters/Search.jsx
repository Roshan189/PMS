import { Input } from "antd";
import { useState } from "react";
const { Search } = Input;

const GenSearch = () => {
  const [search, setSearch] = useState("");

  const onSearch = () => {
    console.log("saerchValue", search);
  };

  return (
    <>
      <Search
        placeholder="input search text"
        onSearch={onSearch}
        onChange={(e) => setSearch(e.target.value)}
        enterButton
        style={{ width: "40%", marginLeft: "60%", marginBottom: "2%" }}
      />
    </>
  );
};
export default GenSearch;
