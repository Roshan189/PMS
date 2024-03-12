import { Button, Form, Input, Select } from "antd";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const User = () => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="91">+91</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: "91",
      }}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="userId"
        label="UserId"
        rules={[
          {
            type: "text",
            message: "The input is not valid userId!",
          },
          {
            required: true,
            message: "Please input your userId!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
            min: 3,
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="zone"
        label="Zone"
        rules={[
          {
            required: true,
            message: "Please select zone!",
          },
        ]}
      >
        <Select placeholder="select your zone">
          <Option value="zone1">Zone1</Option>
          <Option value="zone2">Zone2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="circle"
        label="Circle"
        rules={[
          {
            required: true,
            message: "Please select circle!",
          },
        ]}
      >
        <Select placeholder="select your circle">
          <Option value="circle1">Circle1</Option>
          <Option value="circle2">Circle2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="division"
        label="Division"
        rules={[
          {
            required: true,
            message: "Please select division!",
          },
        ]}
      >
        <Select placeholder="select your division">
          <Option value="division1">Division1</Option>
          <Option value="division2">Division2</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="designation"
        label="Designation"
        rules={[
          {
            type: "text",
            message: "The input is not valid designation!",
          },
          {
            required: true,
            message: "Please input your designation!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            type: "text",
            message: "The input is not valid Name!",
          },
          {
            required: true,
            message: "Please input your Name!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: "Please input your phone number!",
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: "100%",
          }}
        />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            required: true,
            message: "Please select gender!",
          },
        ]}
      >
        <Select placeholder="select your gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="isActive"
        label="IsActive"
        rules={[
          {
            required: true,
            message: "Please select status!",
          },
        ]}
      >
        <Select placeholder="select your status">
          <Option value="yes">Yes</Option>
          <Option value="no">No</Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};
export default User;
