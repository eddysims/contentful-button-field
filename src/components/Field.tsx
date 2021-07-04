import React, { useEffect } from 'react';
import { Note, SectionHeading, Paragraph } from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { RaiButton } from './RaiButton';
import { RaiList } from './RaiList';

interface FieldProps {
  sdk: FieldExtensionSDK;
}

function Field({ sdk }: FieldProps) {
  // @ts-expect-error
  const { raiFieldType } = sdk.parameters.instance ?? "";

  useEffect(() => { sdk.window.startAutoResizer(); })

  return renderField();

  function renderField() {
    switch (raiFieldType) {
      case "button":
        return <RaiButton sdk={sdk} />
      case "list":
        return <RaiList sdk={sdk} />
      default:
        return <UnknownFieldType type={raiFieldType} />
    }
  }
}

interface UnknownFieldTypeProps {
  type: string;
}

function UnknownFieldType({ type }: UnknownFieldTypeProps) {
  return (
    <Note noteType="warning">
      <SectionHeading>Unknown Field Type</SectionHeading>
      <Paragraph>
        Unknown field type <strong>"{type}"</strong>. Please check your content modal.
      </Paragraph>
    </Note>
  )
}

export default Field
