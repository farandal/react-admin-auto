import { Button } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { linkToRecord } from 'react-admin';
import { ReactNode, useEffect,useCallback, Children } from 'react';
import * as React from 'react';
import {

  ArrayInput,
  AutocompleteArrayInput,
  AutocompleteInput,
  ImageInput,
  BooleanInput,
  DateInput,
  DateTimeInput,
  NumberInput,
  SelectArrayInput,
  SelectInput,
  TextField,
  TextInput,

  ArrayField,
  BooleanField,

  ChipField,
  Create,
  Datagrid,
  DateField,

  Edit,
  Filter,
  FormTab,
  List,

  NumberField,
  ImageField,

  Pagination,
  PasswordInput,
  ReferenceArrayField,
  ReferenceArrayInput,
  ReferenceField,
  ReferenceInput,
  ReferenceManyField,
  Resource,

  Show,
  ShowButton,
  SimpleFormIterator,
  SingleFieldList,
  Tab,
  TabbedForm,
  TabbedShowLayout,
  WithRecord,
  useResourceContext,
  useCreate,
  useCreateContext,

} from 'react-admin';

import { useCreatePath, useRecordContext } from 'react-admin';
import { useUpdate } from 'react-admin';

export interface ICustomResourceSubComponent {
  model?: string;
  schema?: AutoAdminAttribute[]
  references?: AutoAdminReference[];
  label?: string;
}

export interface IAutoAdminCustomFieldComponent {
  //id: number | string;
  //record:any;
  method: string;
  attribute: AutoAdminAttribute;
}

type ActionCallback = (id: string) => void;

export interface AutoAdminAttribute {
  attribute: string;
  modelAttribute?: string;
  type: React.FC<IRecord> | string | string[] | Object | DateConstructor | NumberConstructor | StringConstructor | AutoAdminAttribute[];
  tab?: string;
  label?: string;
  inList?: boolean;
  extended?: boolean;
  readOnly?: boolean;
  isPassword?: boolean;
  fieldOptions?: any;
  action?: any;//ReactNode | React.FC<IRecord> | ActionCallback;
  actionProps?: any;
  validate?: (value: any, allValues: any) => JSX.Element | string | undefined;
  pagination?: boolean;
  multiple?: boolean;
  //component?:   'ArrayInput' | 'AutocompleteArrayInput' | 'AutocompleteInput' | 'BooleanInput'| 'DateInput'| 'DateTimeInput'| 'NumberInput'| 'SelectArrayInput'| 'SelectInput'| 'TextInput';
  component?: any;
  searchField?: string;
  listAttribute?: string;
  custom?: boolean;
}

export interface AutoAdminReference {
  reference: string;
  target: string;
  tab?: string;
  schema: AutoAdminAttribute[];
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

const isFC = (Component) => {
  if (typeof Component === "undefined") return false;
  return !!Component.name
}

const isComponent = (Component) => {
  if (typeof Component === "undefined") return false;
  return !!Component.name
  return (
    typeof Component === 'function' // can be various things
    && !(
      Component.prototype // native arrows don't have prototypes
      && Component.prototype.isReactComponent // special property
    )
  );
}

/* TODO: Implement the class component check, nevertheless, is not mented to be implemented.
const isClassComponent = (Component) => {
  return !!(
    typeof Component === 'function'
    && Component.prototype
    && Component.prototype.isReactComponent
  );
}
*/

ListStringsField.defaultProps = { addLabel: true };

const enumToChoices = (e: any) => Object.keys(e).map((key: string) => ({ id: e[key], name: key }));

export interface IRecord {
  id?: string;
  record?: any;
  attribute?: AutoAdminAttribute;
  [key: string]: any;
}

const UserAction: React.FC<{
  //label: string;
  //record?: IRecord;
  //action: ActionCallback | React.ComponentType<IRecord>;
  attribute?: AutoAdminAttribute; // TODO attribute must required?
  method: "view" | "edit";
}> = ({ method, attribute }) => {

  if (attribute.component && isFC(attribute.component)) {
    const Action = attribute.component as React.FC<IRecord>;
    /*
    if (attribute.actionProps) {
      return <WithRecord label={attribute.label} render={record => <Action {...attribute.actionProps} id={record.id} attribute={attribute} record={record} />} />;
    } else {
      return <WithRecord label={attribute.label} render={record => <Action id={record.id} attribute={attribute} record={record} />} />;
    }
    */
    return <Action method={method} attribute={attribute} />;
    // return <Action id={record.id} record={record} attribute={attribute}  />;
  }

  if (attribute.component && isComponent(attribute.component)) {
    const Action = attribute.component;
    return Action(method, attribute);
  }

  /*if (isClassComponent(record.action)) {
    const Action = attribute.action as React.Component<IRecord>;
    return <Action id={record.id} record={record} attribute={attribute}  />;
  }*/

  if (typeof attribute.action === 'function') {
    const callback = attribute.action as ActionCallback;

    return (
      <WithRecord label={attribute.label} render={record => <Button value={attribute.label} onClick={() => callback(record.id)}>
        {attribute.label}
      </Button>} />
    );
  }


  return null;
};

/*export interface IAttributeToField {
  input: AutoAdminAttribute;
}*/
export const AttributeToField = (input: AutoAdminAttribute) => {
  //export const AttributeToField: React.FC<IAttributeToField> = ({ input }) => {

  if (input.custom && input.component) {
      return <UserAction method={"view"} attribute={input} />;
  }

  if (Array.isArray(input.type) && input.type.length > 0) {
    const inputType: string | AutoAdminAttribute = input.type[0];

    /* Force the label to be the attribute name */
    if (!input.label) {
      input.label = input.attribute;
    }
    /* Array of enum values – We use a SelectArrayInput */
    if (isEnum(inputType)) {
      return <ListStringsField label={input.label} source={input.listAttribute ? input.listAttribute : input.attribute} map={inputType} />;
    }

    if (typeof inputType === 'string') {
      const [reference, sourceName] = inputType.split('.');
      return (
        <ReferenceArrayField label={input.label} link='show' source={input.listAttribute ? input.listAttribute : input.attribute} reference={reference}>
          <SingleFieldList link='show'>
            <ChipField source={sourceName} link='show' />
          </SingleFieldList>
        </ReferenceArrayField>
      );

    } else {
      const inputTypeArray = input.type as AutoAdminAttribute[];
      return (
        <ArrayField label={input.label} source={input.listAttribute ? input.listAttribute : input.attribute}>
          <Datagrid>{inputTypeArray.map(attribute => AttributeToField(attribute))}</Datagrid>
        </ArrayField>
      );
    }
  }

 

  if (typeof input.type === 'string') {
    const [reference, sourceName] = input.type.split('.');

    let filter: any = {};
    filter.pagination = input.pagination;
    filter.searchField = input.searchField;

    if (input && input.multiple === false) {
      return (
        <ReferenceField pagination={filter.pagination} filter allowEmpty label={input.label} link='show' source={input.listAttribute ? input.listAttribute : input.attribute} reference={reference}>
          <TextField source={sourceName} />
        </ReferenceField>
      );
    }

    return (
      <ReferenceArrayField pagination={filter.pagination} filter label={input.label} link='show' source={input.listAttribute ? input.listAttribute : input.attribute} reference={reference}>
        <SingleFieldList link='show'>
          <ChipField source={sourceName} link='show' />
        </SingleFieldList>
      </ReferenceArrayField>
    );

  }

  switch (input.type) {
    case Number:
      return <NumberField label={input.label} source={input.listAttribute ? input.listAttribute : input.attribute} options={input.fieldOptions} />;
    case Boolean:
      return <BooleanField label={input.label} source={input.listAttribute ? input.listAttribute : input.attribute} options={input.fieldOptions} />;
    case Date:
      return (
        <DateField
          label={input.label}
          showTime={(input.fieldOptions && input.fieldOptions.showTime) || false}
          source={input.listAttribute ? input.listAttribute : input.attribute}
          options={input.fieldOptions}
        />
      );
    case ImageInput:
      return (
        <ImageField source={input.attribute} label={input.label} />
      );
  }
  return <TextField label={input.label} source={input.listAttribute ? input.listAttribute : input.attribute} options={input.fieldOptions} />;
};


/*export interface IAttributeToInput {
  input: AutoAdminAttribute;
}*/

export const AttributeToInput = ( input ) => {

//export const AttributeToInput: React.FC<IAttributeToInput> = ({ input }) => {

  /*let filter: any = {};
  filter.pagination = input.pagination;
  filter.searchField = input.searchField;*/

  if (input.readOnly === true) {
    return AttributeToField(input);
  }
  /* Force the label to be the attribute name */
  if (!input.label) {
    input.label = input.attribute;
  }

  if (input.custom && input.component) {
    return <UserAction method="edit" attribute={input} />;
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
     
      //   let filter:any = {};
      //   if(input.pagination) filter.pagination = input.pagination;
      //   if(input.searchField) filter.searchField = input.searchField;
      if (input && input.multiple === false) {

        return (
          <ReferenceInput
            allowEmpty
            //sort={{ field: 'name', order: 'ASC' }}
            filter
            pagination={false}
            label={input.label}
            reference={reference}
            source={input.attribute}
          >
            <input.component optionText={safeIfNull} />
          </ReferenceInput>
        );
      }
      
      return (
        <ReferenceArrayInput filter /*allowEmpty*/ label={input.label} reference={reference} source={input.attribute}>
          {/*input.component === 'AutocompleteInput'  ? <AutocompleteInput  optionText={safeIfNull} /> : <SelectInput optionText={safeIfNull}  />*/}

          <SingleFieldList link='show'>
            <ChipField source={sourceName} link='show' />
          </SingleFieldList>
          {/* <input.component  optionText={safeIfNull} /> */}

        </ReferenceArrayInput>
      );

    } else {
      const inputTypeArray = input.type as AutoAdminAttribute[];

      return (
        <ArrayInput label={input.label} source={input.attribute}>
          <SimpleFormIterator>{inputTypeArray.map(attribute => AttributeToInput(attribute))}</SimpleFormIterator>
        </ArrayInput>
      );
    }
  }


  /* Special cases – Passing strings, passing enums */
  if (typeof input.type === 'string') {
    /* table.field */
    const [reference, sourceName] = input.type.split('.');
    let component = SelectInput;
    if (input.component) component = input.component;
    if (input && input.multiple === false) {

      return (
        <ReferenceInput
          allowEmpty
          filters
          label={input.label}
          source={input.attribute}
          reference={reference}
          sort={{ field: sourceName, order: 'ASC' }}>
          <input.component optionText={sourceName} />
        </ReferenceInput>
      );
    }

    if (input && component == ImageInput) {
      return (
        <ImageInput source={input.attribute} label={input.label} accept="image/*">
          <ImageField source="src" title="title" />
        </ImageInput>
      );
    }
   
    return (

      <ReferenceArrayInput /*allowEmpty*/ reference={reference} source={input.attribute} >
        {/*<input.component optionText={sourceName} />*/}
       { /*<SingleFieldList >
            <ChipField source={sourceName}  />
       </SingleFieldList>*/}
       <SelectArrayInput optionText={sourceName} />
      </ReferenceArrayInput>
    );

  }

  switch (input.type) {
    case Number:
      return <NumberInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
    case Boolean:
      return <BooleanInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
    case Date:
      return input.fieldOptions && input.fieldOptions.showTime ? (
        <DateTimeInput label={input.label} source={input.attribute} options={{ ...input.fieldOptions, ampm: false }} />
      ) : (
        <DateInput label={input.label} source={input.attribute} options={input.fieldOptions} />
      );
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

  if (input.isPassword) { // @TODO! Ya no hay LongTextInput! reemplazar
    return <PasswordInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
  }

  if (input.extended) { // @TODO! Ya no hay LongTextInput! reemplazar
    return <TextInput label={input.label} source={input.attribute} options={input.fieldOptions} />;
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

/*export interface IAutoFormTabs {
  schema: AutoAdminAttribute[];
  children?: JSX.Element;
}*/

//export const AutoFormTabs: React.FC<IAutoFormTabs> = ({ schema, children }) => {
export const AutoFormTabs = (schema: AutoAdminAttribute[]) => {

  return (
    groupByTabs(schema).map((groupOfAttributes,idx) => (
      <FormTab key={idx} label={groupOfAttributes[0].tab || 'Datos'}>
        {groupOfAttributes.map((attribute) => AttributeToInput(attribute))}
      </FormTab>
    ))
  )

};


export interface IAutoTabbedForm {
  schema: AutoAdminAttribute[];
  toolbar?: JSX.Element;
  onSubmit?: (values:any) => any;
  onError?: (error:any) => any;
  mode?: "create" | "update";
  children?: JSX.Element;
}

export const AutoTabbedForm: React.FC<IAutoTabbedForm> = ({ schema, onSubmit,onError, toolbar,mode,children }) => {

  
  const resource = useResourceContext();
  const record = useRecordContext();
  const [create,{error:createError,isLoading:createLoading,isError:createErrored}] = useCreate();
  const { onCancelCreate, onCreate } = useCreateContext();

  const [update, { isLoading:updateLoading, error:updateErrored }] = useUpdate();

  const onCreateSave = useCallback(
    
      async values => {
        
        try {
          
          await create(resource, { data: values }, {
            returnPromise: true
          });
          if(onSubmit) { onSubmit(values); }

        } catch(error) {
          if(onError) { onError(error); }
          let response = JSON.parse(localStorage.getItem("lastValidationError"));
          localStorage.removeItem("lastValidationError");
          return response;
        }
    },
    [create,onCreate,onError]
  );

  const onUpdateSave = useCallback(
    async values => {
      try {
       
        await  update(
          resource,
          { id: record.id, data: values, previousData: record }
        )
        if(onSubmit) { onSubmit(values); }

      } catch(error) {
        if(onError) { onError(error); }
        /* @TODO: HACK due react-admin dataProvider error */
        /* https://github.com/marmelab/react-admin/issues/7679 */
        let response = JSON.parse(localStorage.getItem("lastValidationError"));
        localStorage.removeItem("lastValidationError");
        return response;
      }
  },
  [update,updateLoading,onError]
);

  let onSave = onCreateSave;
    switch(mode) {
      case "update":
        onSave = onUpdateSave;
        break; 
      case "create":
        onSave = onCreateSave;
        break;
    }
  
  return (
    <TabbedForm toolbar={toolbar} onSubmit={onSave} validate={validate(schema)}>
      {AutoFormTabs(schema)}
      {/*<AutoFormTabs schema={schema} >{children}</AutoFormTabs>*/}
      {children}   
    </TabbedForm>
  );
};

const ExtendedPagination = (props: any) => <Pagination rowsPerPageOptions={[25, 50, 100, 250, 500, 1000]} {...props} />;


export const AutoReferenceFormTab = (reference: AutoAdminReference) => {
  const record = useRecordContext();
  
  return (
    <FormTab key={reference.reference} label={reference.tab || reference.reference}>
      <ReferenceManyField
        reference={reference.reference}
        //target={[...reference.target]}
        target={reference.target}
        addLabel={false}
        pagination={<ExtendedPagination />}>
        <AutoDataGrid schema={reference.schema} record={record} />
      </ReferenceManyField>

    </FormTab>
  );
};


export const AutoReferenceTab = (reference: AutoAdminReference) => {
  const record = useRecordContext();

  return (
    <Tab key={reference.reference} label={reference.tab || reference.reference}>
      <ReferenceManyField
        reference={reference.reference}
        //target={[...reference.target]}
        target={reference.target}
        addLabel={false}
        pagination={<ExtendedPagination />}>
        <AutoDataGrid schema={reference.schema} record={record} />
      </ReferenceManyField>

    </Tab>
  );
};

export const AutoTabs = (schema: AutoAdminAttribute[]) => {

  return (
    groupByTabs(schema).map(groupOfAttributes => {
      let label = groupOfAttributes[0].tab || 'Datos';
      return <Tab key={"tab_" + label} label={label}>
        {groupOfAttributes.map(attribute => AttributeToField(attribute))}
      </Tab>
    })
  )

};

export interface ITabbedLayout {
  schema: AutoAdminAttribute[]; references?: AutoAdminReference[];
}

const TabbedLayout: React.FC<ITabbedLayout> = ({ schema, references, ...props }) => {
  return (
    <TabbedShowLayout>
      {AutoTabs(schema)}
      {references && references.map(reference => AutoReferenceTab(reference))}
    </TabbedShowLayout>
  );
};

export const validate = (schema: AutoAdminAttribute[]) => (values: { [field: string]: string | JSX.Element }) => {
  const errors: { [field: string]: string | JSX.Element } = {};
  schema.forEach(field => {
    if (field.validate) {
      try {
          if(field.validate(values[field.attribute], values))
                errors[field.attribute] = field.validate(values[field.attribute], values);
      } catch (e) {
        errors[field.attribute] = 'Validation threw an exception: ' + e;
      }
    }
  });
  return errors;
};

export interface IReferenceFilter {
  label: string; // filter label
  source: string; // id field
  reference: string; // model that references
  optionText: string; // field from the model
}
export const AutoFilterGenerator = (referenceFilters?: IReferenceFilter[]) => (props: any) => {
  return (
    <Filter {...props}>
      <TextInput label='Search' source='q' alwaysOn={true} />
      {referenceFilters &&
        referenceFilters.length > 0 &&
        referenceFilters.map(r => (
          <ReferenceInput label={r.label} source={r.source} reference={r.reference} allowEmpty>
            <SelectInput optionText={r.optionText} />
          </ReferenceInput>
        ))}
    </Filter>
  );
};

export interface IAutoTitle {
  record?: any; schema: AutoAdminAttribute[];
}

export const AutoTitle: React.FC<IAutoTitle> = (props) => {
  return <span>Edit {props.record ? `"${props.record[props.schema[0].attribute]}"` : ''}</span>;
};

export interface IAutoForm {
  schema: AutoAdminAttribute[];
  toolbar?: JSX.Element;
  onSubmit?: (values:any) => any;
  onError?: (error:any) => any;
  mode: "create" | "update";
  children?: any;
}

export const AutoCreate: React.FC<IAutoForm> = ({schema,toolbar,onSubmit,mode,onError,children}) => {
  return <Create ><AutoTabbedForm schema={schema} toolbar={toolbar} onSubmit={onSubmit} onError={onError} mode={mode} >{children}</AutoTabbedForm></Create>;
};

export interface IAutoShow {
  schema: AutoAdminAttribute[]; references?: AutoAdminReference[]
}
export const AutoShow: React.FC<IAutoShow> = (props) => {

  return (
    <Show title={<AutoTitle schema={props.schema} />} {...props}>
      <TabbedLayout schema={props.schema} references={props.references} />
    </Show>
  );
};


export const AutoEdit: React.FC<IAutoForm> =  ({schema,toolbar,onSubmit,onError,children}) => {
  return (
    <Edit title={<AutoTitle schema={schema} />}>
      <AutoTabbedForm mode="update" schema={schema} toolbar={toolbar} onSubmit={onSubmit} onError={onError}  >{children}</AutoTabbedForm>
    </Edit>
  );
};

export interface IAutoDataGrid {
  record?: any
  schema: AutoAdminAttribute[]
  resource?: string
}

export const AutoDataGrid: React.FC<IAutoDataGrid> = ({ schema, record,resource, ...props }) => {
  
  const schemaIncludesId = schema.filter(attribute => attribute.attribute === 'id').length !== 0;

  /*
  @TODO: Not implemented
  const createPath = useCreatePath();
  const link  = (record: any) => {
    console.log(createPath({ resource: record, type: 'show', id: record.id }));
  }*/

  return (
    <Datagrid>
      {!schemaIncludesId && (
        <TextField
          source='id'
          onClick={
            (record &&
              (() => {
                console.error("Not implemented")
              })) ||
            undefined
          }
        />
      )}
      {schema.filter(attribute => attribute.inList !== false).map(attribute => AttributeToField(attribute))}
      <ShowButton resource={resource} />
    </Datagrid>
  );
};

export interface IAutoList {
  schema: AutoAdminAttribute[]; exporter?: any; referenceFilters?: IReferenceFilter[]
  record?: any;
  resource?: string
}

export const AutoList: React.FC<IAutoList> = ({schema,exporter,referenceFilters,record,resource}) => {

  const CustomAutoFilter = AutoFilterGenerator(referenceFilters);
  const _record = record ? record : useRecordContext();

  return (
    <List  exporter={exporter} filters={<CustomAutoFilter />} pagination={<ExtendedPagination />}>
      <AutoDataGrid resource={resource} schema={schema} record={_record} />
    </List>
  );
};

export interface IAutoResource {

  model: string;
  label: string;
  show?: boolean;
  list?: boolean;
  edit?: boolean;
  create?: boolean;

  schema: AutoAdminAttribute[];
  references?: AutoAdminReference[];
  exporter?: any;
  referenceFilters?: IReferenceFilter[];


}


export const AutoResource = (
  {
    model,
    label,
    schema,
    references,
    exporter,
    referenceFilters,
    show,
    list,
    edit,
    create,
    icon,
    group
  }: {
    model: string,
    label: string,
    schema: AutoAdminAttribute[];
    references?: AutoAdminReference[];
    exporter?: any;
    referenceFilters?: IReferenceFilter[];
    show?: boolean | React.FC;
    list?: boolean | React.FC;
    edit?: boolean | React.FC;
    create?: boolean | React.FC;
    icon?: any | JSX.Element | React.ReactNode;
    group?: string;
  }
) => {



  let props: any = {};

  if (typeof list !== "boolean" && isFC(list)) {
    const CustomList: React.FC<IRecord> = list;
    props.list = () => <CustomList schema={schema} exporter={exporter} referenceFilters={referenceFilters} />
  } else if (list !== false) {
    props.list = () => <AutoList schema={schema} exporter={exporter} referenceFilters={referenceFilters} />
  }

  if (typeof show !== "boolean" && isFC(show)) {
    const CustomShow: React.FC<IRecord> = show;
    props.list = () => <CustomShow schema={schema} references={references} />
  } else if (show !== false) {
    props.show = () => <AutoShow schema={schema} references={references} />
  }


  if (typeof edit !== "boolean" && isFC(edit)) {
    const CustomEdit: React.FC<IRecord> = edit;
    props.list = () => <CustomEdit schema={schema} />
  } else if (edit !== false) {
    props.edit = () => <AutoEdit mode="update" schema={schema} />
  }


  if (typeof create !== "boolean" && isFC(create)) {
    const CustomCreate: React.FC<IRecord> = create;
    props.list = () => <CustomCreate schema={schema} />
  } else if (create !== false) {
    props.create = () => <AutoCreate mode="create" schema={schema} />
  }

  return <Resource
    options={{ label: label, ...(group && {group}) }}
    name={model}
    {...props}
    icon={icon}
    group={group}
  />
};
