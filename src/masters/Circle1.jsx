import { Input, Pagination, Table, Cascader } from "antd";
const { Search } = Input;
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { EditFilled, DeleteFilled } from "@ant-design/icons";

const Circle = () => {
  const [circle, setcircle] = useState([]);
  const [newcircleDesc, setNewcircleDesc] = useState("");
  const [showErr, setShowErr] = useState("");
  const [editcircleId, setEditcircleId] = useState(null);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [zoneOptions, setZoneOptions] = useState([]); // State to store zone options

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    fetchAll();
    fetchZoneOptions(); // Fetch zone options on component mount
  }, []);

  useEffect(() => {
    fetchAll();
  }, [pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const fetchZoneOptions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/admin/zone/?name=${search}`
      );
      const formattedOptions = response.data.data.map((zone) => ({
        value: zone.zone_id,
        label: zone.zone_name,
      }));
      setZoneOptions(formattedOptions);
    } catch (error) {
      console.error("Error fetching zone options:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/admin/circle/",
        {
          fk_zone_id: zoneId,
          circle_name: newcircleDesc,
        }
      );
      setcircle([response.data]);
      setNewcircleDesc("");
      fetchAll();
    } catch (error) {
      console.log(error);
      setShowErr(error.response?.data?.error[0]?.message);
    }
  };

  const onChange = (value, selectedOptions) => {
    console.log("value", value);
    console.log("selectedOptions", selectedOptions);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#EAEDED",
      }}
    >
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          marginTop: "3%",
        }}
      >
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          enterButton
          style={{ width: "40%", marginLeft: "60%", marginBottom: "2%" }}
        />
        <form
          onSubmit={editcircleId !== null ? handleUpdate : handleFormSubmit}
        >
          <Cascader
            placeholder="select zone"
            options={zoneOptions} // Pass zone options to the Cascader component
            onChange={onChange}
          />

          {/* Rest of your code */}
        </form>
      </div>
    </div>
  );
};

export default Circle;
