import { RadioButton } from '@/components/shared';
import { test, expect } from '@playwright/experimental-ct-react';

test('renders children and handles click', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <RadioButton
      active={false}
      onClick={() => {
        clicked = true;
      }}>
      Choose me
    </RadioButton>
  );
  await expect(component).toContainText('Choose me');
  await expect(component).toHaveClass(/inactive/);
  await component.click();
  expect(clicked).toBeTruthy();
});

test('shows active class when active=true', async ({ mount }) => {
  const component = await mount(
    <RadioButton active={true}>Active</RadioButton>
  );
  await expect(component).toContainText('Active');
  await expect(component).toHaveClass(/active/);
});

test('applies disabled state and does not call onClick', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <RadioButton
      active={false}
      disabled
      onClick={() => {
        clicked = true;
      }}>
      Disabled option
    </RadioButton>
  );
  await expect(component).toContainText('Disabled option');
  await expect(component).toHaveClass(/disabled/);
  await component.click({ force: true });
  expect(clicked).toBeFalsy();
});

test('does not pass unexpected props to element', async ({ mount }) => {
  const component = await mount(
    // @ts-ignore
    <RadioButton notARealProp='123'>Wrong Prop</RadioButton>
  );

  const attr = await component.getAttribute('notARealProp');
  expect(attr).toBeNull();
});

test('does not call onClick when disabled', async ({ mount }) => {
  let clicked = false;
  const component = await mount(
    <RadioButton
      disabled
      onClick={() => {
        clicked = true;
      }}>
      Should not click
    </RadioButton>
  );
  await component.click({ force: true });
  expect(clicked).toBeFalsy();
});
