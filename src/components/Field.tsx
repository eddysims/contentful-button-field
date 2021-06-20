import React, { ChangeEvent, useEffect, useState } from 'react';
import { Form, CheckboxField, TextField } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface ActionProps {
  title: string;
  url: string;
  external: boolean;
}

const Field = ({ sdk }: FieldProps) => {
  const { action } = sdk.field.getValue();
  const [newAction, setNewAction] = useState<ActionProps>({
    title: action?.title ?? "",
    url: action?.url ?? '',
    external: action?.external ?? false
  });

  const urlHelpText = newAction.external ?
    'External url should be a path to the full url you would like to link to. Example: "https://eddysims.com"' :
    'Internal urls should be only the slug of the page you would like to link to. Example "/a-page-to-link-to"';

  useEffect(() => { sdk.window.startAutoResizer(); })

  useEffect(() => {
    updateFieldValue(sdk, newAction);
  }, [newAction, sdk]);


  return (
    <Form>
      <TextField
        id="title"
        name="title"
        labelText="Title"
        value={newAction.title}
        onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
      />
      <TextField
        id="url"
        name="url"
        labelText="Url"
        helpText={urlHelpText}
        value={newAction.url}
        onChange={handleUrlChange}
      />
      <CheckboxField
        labelText="External link"
        helpText="Is this a link to outside of the Responsible AI website?"
        id="external"
        checked={newAction.external}
        onChange={handleExternalChange}
      />
    </Form>
  );

  function handleExternalChange(event: ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setNewAction({
      ...newAction,
      url: checked ? 'https://' : '/',
      external: checked
    })
  }

  function handleUrlChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setNewAction({
      ...newAction,
      url: newAction.external ? value : value.toLocaleLowerCase().replace(' ', '-')
    })
  }
};

function updateFieldValue(sdk: FieldProps['sdk'], action: ActionProps) {
  sdk.field.setValue({ action })
}

export default Field;
