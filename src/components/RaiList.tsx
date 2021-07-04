import React, { ChangeEvent, useEffect, useState } from 'react';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import {
  Form,
  TextField,
  Button,
  Card,
  Flex,
  Paragraph,
} from '@contentful/forma-36-react-components';

interface RaiListProps {
  readonly sdk: FieldExtensionSDK;
}

export function RaiList({ sdk }: RaiListProps) {
  const { items } = sdk.field.getValue() || [];
  const [newItems, setNewItems] = useState(items || []);
  const [value, setValue] = useState('')

  useEffect(() => {
    console.log('setItems')
    sdk.field.setValue({ items: newItems })
  }, [newItems, sdk]);


  return (
    <div>
      <Form>
        {/* @ts-expect-error */}
        <TextField textarea labelText="Add new item" name="value" id="value" value={value} onChange={handleChange} onKeyPress={handleKeyPress} />
        <Button onClick={handleAddClick} disabled={value === ''} size="small">Add Item</Button>
      </Form>

      <Form>
        {newItems.map((item: string, index: number) => {
          return (
            <ListCard value={item} onRemove={handleRemove} onEdit={handleEdit} />
          )

          function handleRemove() {
            const filteredItems = newItems.filter((v: string, i: number) => i !== index);
            setNewItems(filteredItems);
          }

          function handleEdit(val: string) {
            const filteredItems = newItems.map((v: string, i: number) => i === index ? val : v);
            setNewItems(filteredItems);
          }
        })}
      </Form>
    </div>
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setValue(value);
  }

  function handleAddClick() {
    setValue('');
    if (value) {
      setNewItems([...newItems, value])
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.code !== 'Enter') {
      return;
    }
    setValue('');
    if (value) {
      setNewItems([...newItems, value])
    }
    event.preventDefault();
  }
}

interface ListCardProp {
  value: string
  onRemove(): void;
  onEdit(val: string): void;
}

function ListCard({ value, onRemove, onEdit }: ListCardProp) {
  const [edit, setEdit] = useState(false);
  const [input, setInput] = useState(value);
  return (
    <Flex flexDirection="column">
      <Card>
        {edit ? (
          <TextField textarea labelText="Add new item" name="value" id="value" value={input} onChange={handleChange} />
        ) : (
          <Paragraph>{value}</Paragraph>
        )}

        <Flex style={{ marginTop: '.75em', gap: '.5em' }}>
          {edit ? (
            <Button size="small" onClick={handleSave}>Save</Button>
          ) : (
            <>
              <Button size="small" onClick={() => setEdit(true)}>Edit</Button>
              <Button size="small" buttonType="negative" onClick={handleRemove}>Remove</Button>
            </>
          )}
        </Flex>
      </Card>
    </Flex>
  );

  function handleRemove() {
    onRemove && onRemove();
  }

  function handleSave() {
    setEdit(false);
    onEdit && onEdit(input);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setInput(value);
  }
}
