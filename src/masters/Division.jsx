import { Input, Pagination, Table, Cascader } from "antd";
const { Search } = Input;
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { EditFilled, DeleteFilled } from "@ant-design/icons";

const Division = () => {
  const [Division, setDivision] = useState([]);
  const [newDivisionDesc, setNewDivisionDesc] = useState("");
  const [showErr, setShowErr] = useState("");
  const [editDivisionId, setEditDivisionId] = useState(null); // State to track the Division being edited
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    pageSize: 10,
    totalPages: 0,
    currentPage: 1,
    nextPage: null,
    prevPage: null,
  });
  const [cascaderOptions, setCascaderOptions] = useState([]);
  const [zoneId, setZoneId] = useState("");
  // const [zoneName, setZoneId] = useState("");
  const [selectedZoneName, setselectedZoneName] = useState("");

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    fetchAll();
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

  //fetch all data/read
  const fetchAll = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/admin/Division/?name=${search}&page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sortBy=createdAt&sortOrder=DESC`
      );
      setDivision(response.data.data);
      console.log(response.data);
      const {
        totalRecords,
        totalPages,
        currentPage,
        nextPage,
        prevPage,
        pageSize,
      } = response.data.pagination;

      const { data } = response.data;
      setDivision(data);
      setPagination((prevState) => ({
        ...prevState,
        totalRecords: totalRecords,
        totalPages: totalPages,
        pageSize: pageSize,
        currentPage: currentPage,
        nextPage: nextPage,
        prevPage: prevPage,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch cascader data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from API using Axios and async/await
        const response = await axios.get(
          `http://localhost:3000/api/v1/admin/zone/?name=${search}`
        );
        // console.log(response.data);
        const formattedData = response.data.data.map((z) => ({
          value: z["zone_id"],
          label: z["zone_name"],
        }));
        setCascaderOptions(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log(selectedZoneName);
  }, [selectedZoneName, zoneId]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/admin/Division/",
        {
          fk_zone_id: zoneId,
          Division_name: newDivisionDesc,
        }
      );
      setDivision([response.data]);
      setNewDivisionDesc("");

      fetchAll();
    } catch (error) {
      console.log(error);
      setShowErr(error.response?.data?.error[0]?.message);
    }
  };

  //extracting id for edit
  const handleEdit = (record) => {
    setEditDivisionId(record.Division_id); // Set the Division id being edited
    setNewDivisionDesc(record.Division_name);
    // console.log("selectedZoneName:", typeof selectedZoneName);
    setselectedZoneName(record["zone.zone_name"]);
    // console.log("record zone.zone_name", typeof record["zone.zone_name"]);
    // console.log("handle edit", record["zone.zone_name"]);
    setShowErr("");
  };

  //updating the value of desc
  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = /^[a-zA-Z0-9\s()_]+$/.test(newDivisionDesc);
    if (!isValid) {
      setShowErr("Division description is not valid. only alphabets allowed");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/admin/Division/${editDivisionId}`,
        {
          fk_zone_id: zoneId,
          Division_name: newDivisionDesc,
        }
      );
      // Refresh the Division list after update
      fetchAll();
      setNewDivisionDesc(""); // Clear the input field after editing
      setEditDivisionId(null); // Reset edit Division id
      setShowErr("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (record) => {
    try {
      const swalWithBootstrapButtons = MySwal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: true,
      });

      const result = await swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await Swal.fire(
          "Deleted!",
          "Your Division has been deleted.",
          "success"
        );
        console.log("Division id", record.Division_id);
        await axios.delete(
          `http://localhost:3000/api/v1/admin/Division/${record.Division_id}`
        );
        fetchAll();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire("Cancelled", "Your Division entry is safe :)", "error");
      }

      setShowErr("");
    } catch (error) {
      console.log(error);
    }
  };

  // search functionality
  const onSearch = async () => {
    // const response = await axios.get(
    //   `http://localhost:3000/api/v1/admin/Division/?name=${search}`
    // );
    console.log("search value", search);
    await fetchAll();

    // console.log(response.data.data);
    // setSearch(response.data.data);
  };

  //Pagination
  const handlePageChange = (page) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: page,
    }));
  };

  const pageSizeChange = (current, pageSize) => {
    setPagination((prevState) => ({
      ...prevState,
      pageSize: pageSize,
    }));
  };

  //dropdown
  const onChange = (value) => {
    if (value && value.length > 0) {
      const selectedZoneName = value[value.length - 1];
      setZoneId(selectedZoneName);
    } else {
      setZoneId(""); // Reset the zone ID if nothing is selected
    }
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "Division_id",
      key: "Division_id",
      width: "20%",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Division name",
      dataIndex: "Division_name",
      key: "Division_name",
      // width: "0%",
      align: "center",
    },
    {
      title: "  Zone name",
      dataIndex: "zone.zone_name",
      key: "zone.zone_name",
      // width: "0%",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      width: "25%",
      render: (_, record) => (
        <>
          <EditFilled
            type="primary"
            style={{
              marginRight: "15px",
              color: "green",
              textAlign: "center",
            }}
            onClick={() => handleEdit(record)}
          />
          <DeleteFilled
            type="primary"
            style={{ color: "red" }}
            onClick={() => handleDelete(record)}
          />
        </>
      ),
    },
  ];

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
          // border: "2px solid dotted",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Division</h2>

        <Search
          placeholder="input search text"
          onSearch={onSearch}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          enterButton
          style={{ width: "40%", marginLeft: "60%", marginBottom: "2%" }}
        />
        {/* <GenSearch /> */}
        <form
          onSubmit={editDivisionId !== null ? handleUpdate : handleFormSubmit}
        >
          <Table
            bordered
            columns={columns}
            dataSource={Division}
            size="small"
            pagination={false}
            style={{
              marginBottom: "3%",
            }}
          />
          <Pagination
            current={pagination.currentPage}
            total={pagination.totalRecords}
            pageSize={pagination.pageSize}
            onChange={handlePageChange}
            showLessItems={true}
            onShowSizeChange={pageSizeChange}
            showQuickJumper={false}
            showPrevNextJumpers={true}
            showSizeChanger={true}
            onPrev={() => handlePageChange(pagination.prevPage)}
            onNext={() => handlePageChange(pagination.nextPage)}
          />

          {/* dropdown */}
          <Cascader
            options={cascaderOptions}
            onChange={onChange}
            defaultValue={selectedZoneName}
            placeholder="select zone"
            style={{
              marginLeft: "35%",
              marginBottom: "2%",
              marginTop: "5%",
              width: "40%",
            }}
          />

          <div style={{ width: "40%", marginLeft: "35%" }}>
            <Input
              type="text"
              value={newDivisionDesc}
              onChange={(e) => {
                setNewDivisionDesc(e.target.value);
                const isValid = /^[a-zA-Z0-9\s()_]+$/.test(e.target.value);

                isValid
                  ? setShowErr("")
                  : setShowErr("Please Enter valid input!");
              }}
              placeholder="Enter Division Name"
              required
            />
            <p style={{ color: "red" }}>{showErr}</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: "#52BE80",
                padding: "7px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "15px",
                marginBottom: "20px",
                marginRight: "10px",
                marginLeft: "10%",
              }}
            >
              {editDivisionId !== null ? "Update" : "Add Division"}
            </button>
            {editDivisionId !== null && (
              <button
                onClick={() => {
                  setEditDivisionId(null);
                  setNewDivisionDesc("");
                }}
                style={{
                  backgroundColor: "orange",
                  padding: "7px 10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "15px",
                  marginBottom: "20px",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Division;
