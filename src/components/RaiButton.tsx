import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import {
  Form,
  CheckboxField,
  TextField,
  Button,
  Card,
  SectionHeading,
  Flex,
} from '@contentful/forma-36-react-components';

interface RaiButtonProps {
  sdk: FieldExtensionSDK
}

const defaultAction = {
  enabled: false,
  title: '',
  external: false,
  externalUrl: '',
  entrySlug: '',
}

export function RaiButton({ sdk }: RaiButtonProps) {
  const { action } = sdk.field.getValue() || {};
  const [newAction, setNewAction] = useState(action || defaultAction);

  useEffect(() => {
    sdk.field.setValue({ action: newAction })
  }, [newAction, sdk]);

  return (
    <Form>
      <CheckboxField
        id="enabled"
        labelText="Enable the button"
        onChange={handleChange}
        checked={newAction.enabled}
      />
      {newAction.enabled && (
        <Form>
          <TextField
            id="title"
            name="title"
            value={newAction.title}
            onChange={handleChange}
            labelText="Button Title"
          />
          {newAction.external ? (
            <TextField
              id="externalUrl"
              name="externalUrl"
              onChange={handleChange}
              labelText="Link Url"
            />
          ) : (
            <>
              {newAction.entrySlug ? (
                <Form style={{ width: '100%' }}>
                  <Card>
                    <SectionHeading>{newAction.entrySlug}</SectionHeading>
                  </Card>
                  <Button buttonType="negative" onClick={handleRemoveAsset} size="small">Remove Link</Button>
                </Form>
              ) : (
                <Flex style={{ gap: '.5em' }}>
                  <Button size="small" onClick={handleSelectEntry}>Select a Page</Button>
                  <Button size="small" onClick={handleSelectAsset}>Select an Asset</Button>
                </Flex>
              )}
            </>
          )}
          <CheckboxField
            id="external"
            labelText="External Link"
            helpText="Should this button link to a page outside of the Responsible AI website."
            onChange={handleChange}
            checked={newAction.external}
          />
        </Form>
      )}
    </Form>
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { id, value, checked } = event.target;

    setNewAction({
      ...newAction,
      [id]: value || checked || "",
    });
  }

  function handleSelectEntry() {
    sdk.dialogs.selectSingleEntry({ contentTypes: ['page', 'blogPost'] })
      .then((response: any) => {
        setNewAction({
          ...newAction,
          entrySlug: `/${response?.fields?.slug['en-US']}`
        });
      })
  }

  function handleSelectAsset() {
    sdk.dialogs.selectSingleAsset({ mimetypeGroups: ['pdfdocument'] })
      .then((response: any) => {
        setNewAction({
          ...newAction,
          entrySlug: response?.fields?.file['en-US']?.url
        });
      })
  }

  function handleRemoveAsset() {
    setNewAction({
      ...newAction,
      entrySlug: ''
    });
  }
}


