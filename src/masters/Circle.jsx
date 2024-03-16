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
  const [editcircleId, setEditcircleId] = useState(null); // State to track the circle being edited
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
        `http://localhost:3000/api/v1/admin/circle/?name=${search}&page=${pagination.currentPage}&pageSize=${pagination.pageSize}&zoneNameFilter=delhi`
      );
      setcircle(response.data.data);
      // console.log(response.data);
      const {
        totalRecords,
        totalPages,
        currentPage,
        nextPage,
        prevPage,
        pageSize,
      } = response.data.pagination;

      const { data } = response.data;
      setcircle(data);
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
        console.log(response.data);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setZoneId();
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

  //extracting id for edit
  const handleEdit = (record) => {
    setEditcircleId(record.circle_id); // Set the circle id being edited
    setNewcircleDesc(record.circle_name);
    setShowErr("");
  };

  //updating the value of desc
  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = /^[a-zA-Z0-9\s()_]+$/.test(newcircleDesc);
    if (!isValid) {
      setShowErr("Circle description is not valid. only alphabets allowed");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/admin/circle/${editcircleId}`,
        {
          circle_name: newcircleDesc,
        }
      );
      // Refresh the circle list after update
      fetchAll();
      setNewcircleDesc(""); // Clear the input field after editing
      setEditcircleId(null); // Reset edit circle id
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
        await Swal.fire("Deleted!", "Your circle has been deleted.", "success");
        console.log("circle id", record.circle_id);
        await axios.delete(
          `http://localhost:3000/api/v1/admin/circle/${record.circle_id}`
        );
        fetchAll();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire("Cancelled", "Your circle entry is safe :)", "error");
      }

      setShowErr("");
    } catch (error) {
      console.log(error);
    }
  };

  // search functionality
  const onSearch = async () => {
    // const response = await axios.get(
    //   `http://localhost:3000/api/v1/admin/circle/?name=${search}`
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
    console.log(value);
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "circle_id",
      key: "circle_id",
      width: "20%",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Circle name",
      dataIndex: "circle_name",
      key: "circle_name",
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
        {/* <h2 style={{ textAlign: "center" }}>Circle label</h2> */}

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
          onSubmit={editcircleId !== null ? handleUpdate : handleFormSubmit}
        >
          <Table
            bordered
            columns={columns}
            dataSource={circle}
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
            placeholder="Please select"
          />

          <div style={{ width: "60%", marginLeft: "20%" }}>
            <Input
              type="text"
              value={newcircleDesc}
              onChange={(e) => {
                setNewcircleDesc(e.target.value);
                const isValid = /^[a-zA-Z0-9\s()_]+$/.test(e.target.value);

                isValid
                  ? setShowErr("")
                  : setShowErr(
                      "Circle description is not valid. only alphabets allowed"
                    );
              }}
              placeholder="Enter Circle Name"
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
              }}
            >
              {editcircleId !== null ? "Update" : "Add circle"}
            </button>
            {editcircleId !== null && (
              <button
                onClick={() => {
                  setEditcircleId(null);
                  setNewcircleDesc("");
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

export default Circle;
