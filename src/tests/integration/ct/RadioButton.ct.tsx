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
    <RadioButton
      active={true}
      onClick={() => {}}>
      Active
    </RadioButton>
  );
  await expect(component).toContainText('Active');
  await expect(component).toHaveClass(/active/);
});
