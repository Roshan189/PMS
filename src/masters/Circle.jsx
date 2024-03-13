import { Button, Input, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Circle = () => {
  const [zone, setZone] = useState([]);
  const [newZoneDesc, setNewZoneDesc] = useState("");
  const [showErr, setShowErr] = useState("");
  const [editZoneId, setEditZoneId] = useState(null); // State to track the zone being edited

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    fetchAll();
  }, []);

  //fetch all data/read
  const fetchAll = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/admin/zone/"
      );
      setZone(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/admin/zone/",
        {
          zone_name: newZoneDesc,
        }
      );
      setZone([response.data]);
      setNewZoneDesc("");
      fetchAll();
    } catch (error) {
      console.log(error);
      setShowErr(error.response?.data?.error[0]?.message);
    }
  };

  //extracting id for edit
  const handleEdit = (record) => {
    setEditZoneId(record.zone_id); // Set the zone id being edited
    setNewZoneDesc(record.zone_name);
    setShowErr(""); // Populate the input field with the description
  };

  //updating the value of desc
  const handleUpdate = async (e) => {
    e.preventDefault();
    const isValid = /^[a-zA-z]+([\s][a-zA-Z]+)*$/.test(newZoneDesc);
    if (!isValid) {
      setShowErr("Circle description is not valid. only alphabets allowed");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/admin/zone/${editZoneId}`,
        {
          zone_name: newZoneDesc,
        }
      );
      // Refresh the zone list after update
      fetchAll();
      setNewZoneDesc(""); // Clear the input field after editing
      setEditZoneId(null); // Reset edit zone id
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
        await Swal.fire("Deleted!", "Your file has been deleted.", "success");
        await axios.delete(
          `http://localhost:3000/api/v1/admin/zone/${record.zone_id}`
        );
        fetchAll();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        await Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
      }

      setShowErr("");
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Circle_Id",
      dataIndex: "circle_id",
      key: "circle_id",
    },
    {
      title: "Circle_name",
      dataIndex: "circle_name",
      key: "circle_name",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            style={{ marginRight: "5px", backgroundColor: "green" }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
        <h2>Circle</h2>
        <form onSubmit={editZoneId !== null ? handleUpdate : handleFormSubmit}>
          <Input
            type="text"
            value={newZoneDesc}
            onChange={(e) => {
              setNewZoneDesc(e.target.value);
              const isValid = /^[a-zA-z]+([\s][a-zA-Z]+)*$/.test(
                e.target.value
              );

              isValid
                ? setShowErr("")
                : setShowErr(
                    "Circle description is not valid. only alphabets allowed"
                  );
            }}
            placeholder="Enter Circle Name"
          />
          <p style={{ color: "red" }}>{showErr}</p>
          <button
            type="submit"
            style={{
              backgroundColor: "lightblue",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "15px",
              marginBottom: "20px",
              marginRight: "10px",
            }}
          >
            {editZoneId !== null ? "Update circle" : "Add circle"}
          </button>
          {editZoneId !== null && (
            <button
              onClick={() => {
                setEditZoneId(null);
                setNewZoneDesc("");
              }}
              style={{
                backgroundColor: "orange",
                padding: "10px 20px",
                border: "none",
                marginTop: "0px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "15px",
                marginBottom: "20px",
              }}
            >
              Cancel
            </button>
          )}
        </form>
        <div>
          <Table bordered columns={columns} dataSource={zone} />
        </div>
      </div>
    </div>
  );
};

export default Circle;
