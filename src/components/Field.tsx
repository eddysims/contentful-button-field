import React, { useEffect, useState } from 'react';
import { Form, CheckboxField, TextField } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface ButtonProps {
  title: string;
  url: string;
  external: boolean;
}

const Field = ({ sdk }: FieldProps) => {
  const { button } = sdk.field.getValue();
  const [newButton, setNewButton] = useState<ButtonProps>({
    title: button?.title || "",
    url: button?.url || '',
    external: button?.external || false
  });

  const urlHelpText = newButton.external ?
    'External url should be a path to the full url you would like to link to. Example: "https://eddysims.com"' :
    'Internal urls should be only the slug of the page you would like to link to. Example "/a-page-to-link-to"';

  useEffect(() => { sdk.window.startAutoResizer(); })

  useEffect(() => {
    updateFieldValue(sdk, newButton);
  }, [newButton, sdk]);


  return (
    <Form>
      <TextField
        id="title"
        name="title"
        labelText="Button Title"
        value={newButton.title}
        onChange={(e) => setNewButton({ ...newButton, title: e.target.value })}
      />
      <CheckboxField
        labelText="External Link"
        helpText="Is this a link to the Responsible AI website?"
        id="external"
        checked={newButton.external}
        onChange={(e) => setNewButton({ ...newButton, external: e.target.checked })}
      />
      <TextField
        id="url"
        name="url"
        labelText="Button Url"
        helpText={urlHelpText}
        value={newButton.url}
        onChange={(e) => setNewButton({ ...newButton, url: e.target.value })}
      />
    </Form>
  );
};

function updateFieldValue(sdk: FieldProps['sdk'], button: ButtonProps) {
  sdk.field.setValue({ button })
}

export default Field;
