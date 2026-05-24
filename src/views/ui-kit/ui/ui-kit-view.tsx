import { useState } from 'react'
import { Bell, Inbox, Search, Settings, Trash2 } from 'lucide-react'
import { z } from 'zod'

import { emailSchema, requiredString, useZodForm } from '@/shared/lib'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  ErrorState,
  FileUpload,
  FormField,
  Input,
  Label,
  Pagination,
  RadioGroup,
  RadioGroupItem,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui'

const demoFormSchema = z.object({
  name: requiredString('Name is required'),
  email: emailSchema,
  bio: z.string().max(280).optional(),
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      <Card>
        <CardContent className="flex flex-wrap items-start gap-6 p-6">
          {children}
        </CardContent>
      </Card>
    </section>
  )
}

export function UiKitView() {
  const [page, setPage] = useState(1)
  const [notify, setNotify] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const demoForm = useZodForm(demoFormSchema, {
    defaultValues: { name: '', email: '', bio: '' },
  })

  return (
    <TooltipProvider>
      <div className="space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            UI Kit
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Every primitive shipped in this template. Use it as a sanity check after
            pulling in changes. Delete this view with{' '}
            <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
              npm run init -- --clean
            </code>
            .
          </p>
        </header>

        <Section title="Buttons">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="icon" variant="secondary" aria-label="search">
            <Search className="size-4" />
          </Button>
        </Section>

        <Section title="Badges">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </Section>

        <Section title="Inputs">
          <div className="grid w-full max-w-md gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="grid w-full max-w-md gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="A few sentences about yourself" />
          </div>
          <div className="grid w-full max-w-md gap-2">
            <Label htmlFor="role">Role</Label>
            <Select id="role" defaultValue="dev">
              <option value="dev">Developer</option>
              <option value="design">Designer</option>
              <option value="pm">Product manager</option>
            </Select>
          </div>
        </Section>

        <Section title="Selection controls">
          <div className="flex items-center gap-2">
            <Checkbox id="accept" />
            <Label htmlFor="accept">I accept the terms</Label>
          </div>
          <RadioGroup className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem id="r-sm" name="size" value="sm" defaultChecked />
              <Label htmlFor="r-sm">Small</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="r-md" name="size" value="md" />
              <Label htmlFor="r-md">Medium</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="r-lg" name="size" value="lg" />
              <Label htmlFor="r-lg">Large</Label>
            </div>
          </RadioGroup>
          <div className="flex items-center gap-2">
            <Switch
              checked={notify}
              onCheckedChange={setNotify}
              aria-label="notifications"
            />
            <Label>Notifications {notify ? 'on' : 'off'}</Label>
          </div>
        </Section>

        <Section title="Display">
          <Avatar fallback="MM" />
          <Avatar src="https://i.pravatar.cc/80?img=12" alt="user" fallback="MM" />
          <Skeleton className="h-10 w-32" />
          <Spinner />
          <Separator className="my-3" />
        </Section>

        <Section title="Tabs">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent
              value="overview"
              className="text-sm text-zinc-600 dark:text-zinc-400"
            >
              Project overview content.
            </TabsContent>
            <TabsContent
              value="analytics"
              className="text-sm text-zinc-600 dark:text-zinc-400"
            >
              Analytics charts go here.
            </TabsContent>
            <TabsContent
              value="settings"
              className="text-sm text-zinc-600 dark:text-zinc-400"
            >
              Settings live here.
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Overlays">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. The record will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button variant="danger">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="size-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="size-4" /> Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="size-4" /> Delete account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="inbox">
                <Inbox className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Inbox</TooltipContent>
          </Tooltip>
        </Section>

        <Section title="Table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Alice</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bob</TableCell>
                <TableCell>
                  <Badge variant="warning">Pending</Badge>
                </TableCell>
                <TableCell>Editor</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section title="Pagination">
          <Pagination page={page} pageCount={10} onPageChange={setPage} />
        </Section>

        <Section title="Forms">
          <form
            onSubmit={demoForm.handleSubmit(() => undefined)}
            className="grid w-full max-w-md gap-4"
          >
            <FormField
              control={demoForm.control}
              name="name"
              label="Name"
              inputProps={{ placeholder: 'Ada Lovelace' }}
            />
            <FormField
              control={demoForm.control}
              name="email"
              label="Email"
              description="We will only use this to send updates."
              inputProps={{ type: 'email', placeholder: 'ada@example.com' }}
            />
            <FormField control={demoForm.control} name="bio" label="Bio">
              {({ field, id }) => (
                <Textarea
                  id={id}
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Tell us a little about yourself"
                />
              )}
            </FormField>
            <Button type="submit" className="justify-self-start">
              Validate
            </Button>
          </form>
          <FileUpload
            className="w-full max-w-md"
            value={files}
            onChange={setFiles}
            multiple
            accept="image/*,application/pdf"
            hint="PNG, JPG, or PDF up to a few MB."
          />
        </Section>

        <Section title="States">
          <EmptyState
            className="w-full max-w-md"
            icon={<Inbox className="size-6" />}
            title="No messages yet"
            description="Inbox is empty. Try refreshing in a minute."
            action={<Button size="sm">Refresh</Button>}
          />
          <ErrorState className="w-full max-w-md" onRetry={() => undefined} />
        </Section>

        <Card>
          <CardHeader>
            <CardTitle>Card</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
            Card primitive composed with the rest. Useful for grouping content.
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
