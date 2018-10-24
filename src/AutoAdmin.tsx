import Chip from '@material-ui/core/Chip';
import { linkToRecord } from 'ra-core';
import * as React from 'react';
import {
  ArrayField,
  ArrayInput,
  AutocompleteInput,
  Create,
  Datagrid,
  DateField,
  DateInput,
  DisabledInput,
  Edit,
  Filter,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  ReferenceManyField,
  ReferenceArrayField,
  Resource,
  SelectArrayInput,
  SelectInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleFormIterator,
  SimpleShowLayout,
  TextField,
  TextInput,
  SingleFieldList,
  ChipField
} from 'react-admin';

interface AutoAdminAttribute {
  attribute: string;
  type: string | string[] | Object | DateConstructor | NumberConstructor | StringConstructor | AutoAdminAttribute[];
  label?: string;
  inList?: boolean;
  readOnly?: boolean;
  showTime?: boolean;
}

const isEnum = (type: any) => typeof type === 'object' && !(type.attribute && type.type);

const invertMap = (map: any) => {
  if (!map) {
    return false;
  }
  let invertedMap: any = {};
  Object.keys(map).forEach(key => (invertedMap[map[key]] = key));
  return invertedMap;
};

const ListStringsField = ({ record, source, map }: { record?: any; source: string; label: string; map?: any }) => {
  const invertedMap = invertMap(map);
  return (
    <>
      {record[source].map((item: string) => [
        <Chip key={item} label={invertedMap && invertedMap[item] ? invertedMap[item] : item} />,
        <> </>
      ])}
    </>
  );
};
ListStringsField.defaultProps = { addLabel: true };

const enumToChoices = (e: any) => Object.keys(e).map((key: string) => ({ id: e[key], name: key }));

const attributeToField = (input: AutoAdminAttribute) => {
  if (Array.isArray(input.type) && input.type.length > 0) {
    const inputType: string | AutoAdminAttribute = input.type[0];
    /* Array of enum values – We use a SelectArrayInput */
    if (isEnum(inputType)) {
      return <ListStringsField label={input.label} source={input.attribute} map={inputType} />;
    }

    if (typeof inputType === 'string') {
      const [reference, sourceName] = inputType.split('.');
      return (
        <ReferenceArrayField label={input.label} linkType="show" source={input.attribute} reference={reference}>
          <SingleFieldList>
            <ChipField source={sourceName} />
          </SingleFieldList>
        </ReferenceArrayField>
      );
    } else {
      const inputTypeArray = input.type as AutoAdminAttribute[];
      return (
        <ArrayField label={input.label} source={input.attribute}>
          <Datagrid>{inputTypeArray.map(attribute => attributeToField(attribute))}</Datagrid>
        </ArrayField>
      );
    }
  }
  if (typeof input.type === 'string') {
    const [reference, sourceName] = input.type.split('.');
    return (
      <ReferenceField label={input.label} linkType="show" source={input.attribute} reference={reference}>
        <TextField source={sourceName} />
      </ReferenceField>
    );
  }
  switch (input.type) {
    case String:
      return <TextField label={input.label} source={input.attribute} />;
    case Number:
      return <NumberField label={input.label} source={input.attribute} />;
    case Date:
      return <DateField label={input.label} showTime={input.showTime} source={input.attribute} />;
  }
  return <TextField label={input.label} source={input.attribute} />;
};

const attributeToInput = (input: AutoAdminAttribute) => {
  if (Array.isArray(input.type) && input.type.length > 0) {
    const inputType: string | AutoAdminAttribute = input.type[0];
    /* Array of enum values – We use a SelectArrayInput */
    if (isEnum(inputType)) {
      return <SelectArrayInput label={input.label} source={input.attribute} choices={enumToChoices(inputType)} />;
    }
    /* Recurse */

    if (typeof inputType === 'string') {
      const [reference, sourceName] = inputType.split('.');
      return (
        <ReferenceManyField label={input.label} reference={reference} source={input.attribute} linkType="show">
          <SingleFieldList>
            <ChipField source={sourceName} />
          </SingleFieldList>
        </ReferenceManyField>
      );
    } else {
      const inputTypeArray = input.type as AutoAdminAttribute[];
      return (
        <ArrayInput label={input.label} source={input.attribute}>
          <SimpleFormIterator>{inputTypeArray.map(attribute => attributeToInput(attribute))}</SimpleFormIterator>
        </ArrayInput>
      );
    }
  }

  /* Special cases – Passing strings, passing enums */
  if (typeof input.type === 'string') {
    /* table.field */
    const [reference, sourceName] = input.type.split('.');
    return (
      <ReferenceInput
        label={input.label}
        source={input.attribute}
        reference={reference}
        sort={{ field: sourceName, order: 'ASC' }}>
        <AutocompleteInput optionText={sourceName} />
      </ReferenceInput>
    );
  }

  switch (input.type) {
    case String:
      return <TextInput label={input.label} source={input.attribute} />;
    case Number:
      return <NumberInput label={input.label} source={input.attribute} />;
    case Date:
      return <DateInput label={input.label} showTime={input.showTime} source={input.attribute} />;
  }
  if (isEnum(input.type)) {
    return <SelectInput label={input.label} source={input.attribute} choices={enumToChoices(input.type)} />;
  }
  return <TextInput label={input.label} source={input.attribute} />;
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
        {schema.map(
          attribute => (attribute.readOnly !== true ? attributeToInput(attribute) : attributeToField(attribute))
        )}
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
        {schema.filter(attribute => attribute.inList !== false).map(attributeToField)}
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
