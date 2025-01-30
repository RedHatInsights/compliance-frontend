This glossary is a list of terms used within the Compliance service and it's code.

**SSG aka. SCAP Security guide**

This term comes from the Open SCAP Project. The term is used to describe the project as well as it's "content".
In the context of the Compliance service this term is uses to describe a collection of "profiles" and the rules they can have assigned.

**Profiles**

A profile in Compliance is a collection of rules to "comply" to a specific security policy.
The profile is specific to the SSG version as well as supported major operating system version
and might only support a subset of minor versions of the OS. The same applies for Tailorings derived from them.

**(SCAP) Policies**

The term policies or specifically "SCAP policies" describes a (standard/government) security policy from SSG.
But it is also used as the name for the policies that customers have created, derived from a profile from SSG

**Tailorings**

These are the set of rules a customer saved. This collection of rules and their associated value overrides are copied
from "profiles" from SSG, but can have additional rules and overrides for their values.

**Value Overrides**

Certain rules can have "values", which are used to perform a certain check, usually these are default and
come from the associated SSG and rule group. Customers can change these values in their tailorings and are saved as "value_overrides".
These value overrides can be associated with multiple rules in the rule group the value definition is available for.

**Rule Values**

"Rule values" is an ambiguous term. Generally it is used to describe the combination, of "value checks" on rules,
which are an array of "value definition" IDs and the "value overrides" from tailorings.

**Value Definitions**

Value definitions are an object that is associated to a "rule group" in the security guide profile.
They describe what the value is used for, what it can be and what it's defaults are.
Rules can have these associated as "value_checks".

**Value checks**

A rule can come with "value checks" associated. This is an array with IDs of value definitions and
should be used to query "value overrides" from the tailoring, as well as the definitions of the "value definition" from the security guide.
