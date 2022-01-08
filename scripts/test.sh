#!/bin/bash
# Run tests

code=0

for file in test/*; do
    node $file || code=1
done

exit $code
