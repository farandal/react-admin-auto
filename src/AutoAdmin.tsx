import { linkToRecord } from 'ra-core';
import * as React from 'react';
import {
  ArrayField,
  ArrayInput,
  Create,
  Datagrid,
  DisabledInput,
  Edit,
  Filter,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  Resource,
  SelectInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleFormIterator,
  SimpleShowLayout,
  TextField,
  TextInput
} from 'react-admin';

interface AutoAdminAttribute {
  attribute: string;
  type: string | NumberConstructor | StringConstructor | AutoAdminAttribute[];
}

const attributeToField = (input: AutoAdminAttribute) => {
  if (Array.isArray(input.type)) {
    return (
      <ArrayField source={input.attribute}>
        <Datagrid>{input.type.map(attribute => attributeToField(attribute))}</Datagrid>
      </ArrayField>
    );
  }
  if (typeof input.type === 'string') {
    const [reference, sourceName] = input.type.split('.');
    return (
      <ReferenceField linkType="show" source={input.attribute} reference={reference}>
        <TextField source={sourceName} />
      </ReferenceField>
    );
  }
  switch (input.type) {
    case String:
      return <TextField source={input.attribute} />;
    case Number:
      return <NumberField source={input.attribute} />;
  }
  return <TextField source={input.attribute} />;
};

const attributeToInput = (input: AutoAdminAttribute) => {
  if (Array.isArray(input.type)) {
    return (
      <ArrayInput source={input.attribute}>
        <SimpleFormIterator>{input.type.map(attribute => attributeToInput(attribute))}</SimpleFormIterator>
      </ArrayInput>
    );
  }
  if (typeof input.type === 'string') {
    const [reference, sourceName] = input.type.split('.');
    return (
      <ReferenceInput source={input.attribute} reference={reference} sort={{ field: sourceName, order: 'ASC' }}>
        <SelectInput source={sourceName} />
      </ReferenceInput>
    );
  }
  switch (input.type) {
    case String:
      return <TextInput source={input.attribute} />;
    case Number:
      return <NumberInput source={input.attribute} />;
  }
  return <TextInput source={input.attribute} />;
};

export const AutoFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn={true} />
  </Filter>
);
const AutoTitle = ({ record, schema }: { record?: any; schema: AutoAdminAttribute[] }) => {
  return <span>Edit {record ? `"${record[schema[0].attribute]}"` : ''}</span>;
};

export const AutoCreate = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Create title="Create a course" {...props}>
      <SimpleForm>{schema.map(attributeToInput)}</SimpleForm>
    </Create>
  );
};

export const AutoShow = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Show title={<AutoTitle schema={schema} />} {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        {schema.map(attributeToField)}
      </SimpleShowLayout>
    </Show>
  );
};

export const AutoEdit = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Edit title={<AutoTitle schema={schema} />} {...props}>
      <SimpleForm>
        <DisabledInput source="id" />
        {schema.map(attributeToInput)}
      </SimpleForm>
    </Edit>
  );
};

export const AutoList = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <List {...props} filters={<AutoFilter />}>
      <Datagrid>
        <TextField
          source="id"
          onClick={() => (document.location = linkToRecord(props.basePath, props.record.id, 'show'))}
        />
        {schema.map(attributeToField)}
        <ShowButton basePath={props.basePath} />
      </Datagrid>
    </List>
  );
};

export const AutoResource = (modelName: string, { schema }: { schema: AutoAdminAttribute[] }) => {
  const list = (props: any) => AutoList(props, { schema });
  const show = (props: any) => AutoShow(props, { schema });
  const edit = (props: any) => AutoEdit(props, { schema });
  const create = (props: any) => AutoCreate(props, { schema });
  const icon = 'address-book';

  return <Resource name={modelName} list={list} show={show} edit={edit} create={create} icon={icon} />;
};
