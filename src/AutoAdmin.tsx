import { SchemaTypeOpts } from "mongoose";
import * as React from "react";
import {
  Create,
  Datagrid,
  DisabledInput,
  Edit,
  Filter,
  List,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  ShowButton
} from "react-admin";
import { linkToRecord } from "ra-core";

interface AutoAdminAttribute {
  attribute: string;
  type: SchemaTypeOpts<any>;
}

const attributeToField = (input: AutoAdminAttribute) => {
  switch (input.type) {
    case String:
      return <TextField source={input.attribute} />;
  }
  return <TextField source={input.attribute} />;
};

const attributeToInput = (input: AutoAdminAttribute) => {
  switch (input.type) {
    case String:
      return <TextInput source={input.attribute} />;
  }
  return <TextInput source={input.attribute} />;
};

const AutoFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn={true} />
  </Filter>
);
const AutoTitle = ({
  record,
  fields
}: {
  record?: any;
  fields: AutoAdminAttribute[];
}) => {
  return <span>Edit {record ? `"${record[fields[0].attribute]}"` : ""}</span>;
};

export default class AutoAdmin {
  static AutoCreate = (props: any, fields: AutoAdminAttribute[]) => {
    return (
      <Create title="Create a course" {...props}>
        <SimpleForm>{fields.map(attributeToInput)}</SimpleForm>
      </Create>
    );
  };

  static AutoShow = (props: any, fields: AutoAdminAttribute[]) => {
    return (
      <Show title={<AutoTitle fields={fields} />} {...props}>
        <SimpleShowLayout>
          <TextField source="id" />
          {fields.map(attributeToField)}
        </SimpleShowLayout>
      </Show>
    );
  };

  static AutoEdit = (props: any, fields: AutoAdminAttribute[]) => {
    return (
      <Edit title={<AutoTitle fields={fields} />} {...props}>
        <SimpleForm>
          <DisabledInput source="id" />
          {fields.map(attributeToInput)}
        </SimpleForm>
      </Edit>
    );
  };

  static AutoList = (props: any, fields: AutoAdminAttribute[]) => {
    return (
      <List {...props} filters={<AutoFilter />}>
        <Datagrid>
          <TextField
            source="id"
            onClick={() =>
              (document.location = linkToRecord(
                props.basePath,
                props.record.id,
                "show"
              ))
            }
          />
          {fields.map(attributeToField)}
          <ShowButton basePath={props.basePath} />
        </Datagrid>
      </List>
    );
  };
}

export const AutoList = AutoAdmin.AutoList;
export const AutoShow = AutoAdmin.AutoShow;
export const AutoEdit = AutoAdmin.AutoEdit;
export const AutoCreate = AutoAdmin.AutoCreate;
