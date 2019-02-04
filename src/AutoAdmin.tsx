import Chip from '@material-ui/core/Chip';
import { linkToRecord } from 'ra-core';
import * as React from 'react';
import {
  ArrayField,
  ArrayInput,
  AutocompleteArrayInput,
  AutocompleteInput,
  BooleanField,
  BooleanInput,
  ChipField,
  Create,
  Datagrid,
  DateField,
  DateInput,
  Edit,
  Filter,
  FormTab,
  List,
  LongTextInput,
  NumberField,
  NumberInput,
  ReferenceArrayField,
  ReferenceArrayInput,
  ReferenceField,
  ReferenceInput,
  Resource,
  SelectArrayInput,
  SelectInput,
  Show,
  ShowButton,
  SimpleFormIterator,
  SingleFieldList,
  Tab,
  TabbedForm,
  TabbedShowLayout,
  TextField,
  TextInput
} from 'react-admin';

interface AutoAdminAttribute {
  attribute: string;
  type: string | string[] | Object | DateConstructor | NumberConstructor | StringConstructor | AutoAdminAttribute[];
  tab?: string;
  label?: string;
  inList?: boolean;
  extended?: boolean;
  readOnly?: boolean;
  fieldOptions?: any;
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

    /* Force the label to be the attribute name */
    if (!input.label) {
      input.label = input.attribute;
    }
    /* Array of enum values – We use a SelectArrayInput */
    if (isEnum(inputType)) {
      return <ListStringsField label={input.label} source={input.attribute} map={inputType} />;
    }

    if (typeof inputType === 'string') {
      const [reference, sourceName] = inputType.split('.');
      return (
        <ReferenceArrayField label={input.label} linkType='show' source={input.attribute} reference={reference}>
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
      <ReferenceField allowEmpty label={input.label} linkType='show' source={input.attribute} reference={reference}>
        <TextField source={sourceName} />
      </ReferenceField>
    );
  }
  switch (input.type) {
    case Number:
      return <NumberField label={input.label} source={input.attribute} options={input.fieldOptions} />;
    case Boolean:
      return <BooleanField label={input.label} source={input.attribute} options={input.fieldOptions} />;
    case Date:
      return (
        <DateField
          label={input.label}
          showTime={input.fieldOptions && input.fieldOptions.showTime}
          source={input.attribute}
          options={input.fieldOptions}
        />
      );
  }
  return <TextField label={input.label} source={input.attribute} options={input.fieldOptions} />;
};

const attributeToInput = (input: AutoAdminAttribute) => {
  if (input.readOnly === true) {
    return attributeToField(input);
  }
  if (Array.isArray(input.type) && input.type.length > 0) {
    const inputType: string | AutoAdminAttribute = input.type[0];
    /* Array of enum values – We use a SelectArrayInput */
    if (isEnum(inputType)) {
      return <SelectArrayInput label={input.label} source={input.attribute} choices={enumToChoices(inputType)} />;
    }
    /* Recurse */

    if (typeof inputType === 'string') {
      const [reference, sourceName] = inputType.split('.');
      const safeIfNull = (choice: any) => (choice ? choice[sourceName] : '?') || '??';
      return (
        <ReferenceArrayInput allowEmpty label={input.label} reference={reference} source={input.attribute}>
          <AutocompleteArrayInput optionText={safeIfNull} />
        </ReferenceArrayInput>
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
        allowEmpty
        label={input.label}
        source={input.attribute}
        reference={reference}
        sort={{ field: sourceName, order: 'ASC' }}>
        <AutocompleteInput optionText={sourceName} />
      </ReferenceInput>
    );
  }

  switch (input.type) {
    case Number:
      return <NumberInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
    case Boolean:
      return <BooleanInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
    case Date:
      return <DateInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
  }
  if (isEnum(input.type)) {
    return (
      <SelectInput
        label={input.label}
        source={input.attribute}
        choices={enumToChoices(input.type)}
        options={input.fieldOptions}
      />
    );
  }
  if (input.extended) {
    return <LongTextInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
  }
  return <TextInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
};

const groupByTabs = (schema: AutoAdminAttribute[]): AutoAdminAttribute[][] => {
  const tabs: AutoAdminAttribute[][] = [];
  schema.forEach(attribute => {
    let added = false;
    tabs.forEach(tab => {
      const name = tab[0].tab;
      if (name === attribute.tab) {
        tab.push(attribute);
        added = true;
      }
    });
    if (!added) {
      tabs.push([attribute]);
    }
  });
  return tabs;
};

const tabbedForm = (schema: AutoAdminAttribute[]) => {
  return (
    <TabbedForm>
      {groupByTabs(schema).map(groupOfAttributes => (
        <FormTab label={groupOfAttributes[0].tab || 'Main'}>
          {groupOfAttributes.map(attribute => attributeToInput(attribute))}
        </FormTab>
      ))}
    </TabbedForm>
  );
};

const tabbedLayout = (schema: AutoAdminAttribute[]) => {
  return (
    <TabbedShowLayout>
      {groupByTabs(schema).map(groupOfAttributes => (
        <Tab label={groupOfAttributes[0].tab || 'Main'}>{groupOfAttributes.map(attributeToField)}</Tab>
      ))}
    </TabbedShowLayout>
  );
};

export const AutoFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label='Search' source='q' alwaysOn={true} />
  </Filter>
);
const AutoTitle = ({ record, schema }: { record?: any; schema: AutoAdminAttribute[] }) => {
  return <span>Edit {record ? `"${record[schema[0].attribute]}"` : ''}</span>;
};

export const AutoCreate = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Create title='Create a course' {...props}>
      {tabbedForm(schema)}
    </Create>
  );
};

export const AutoShow = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Show title={<AutoTitle schema={schema} />} {...props}>
      {tabbedLayout(schema)}
    </Show>
  );
};

export const AutoEdit = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Edit title={<AutoTitle schema={schema} />} {...props}>
      {tabbedForm(schema)}
    </Edit>
  );
};

export const AutoList = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  const schemaIncludesId = schema.filter(attribute => attribute.attribute === 'id').length !== 0;
  return (
    <List {...props} filters={<AutoFilter />}>
      <Datagrid>
        {!schemaIncludesId && (
          <TextField
            source='id'
            onClick={() => (document.location = linkToRecord(props.basePath, props.record.id, 'show'))}
          />
        )}
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
