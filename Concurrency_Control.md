## DIRTY READ -

A "dirty read" is a phenomenon that occurs in database systems when one transaction reads data that has been modified by another uncommitted transaction.
In other words, a dirty read happens when one transaction reads data that might be changed or rolled back by the modifying transaction later, leading to
potentially incorrect or inconsistent information being retrieved.

In MySQL, you can configure the transaction isolation level to control whether dirty reads are allowed. The default isolation level is typically "REPEATABLE READ,"
which prevents dirty reads. However, you can set the isolation level to "READ UNCOMMITTED" to allow dirty reads.

Let's look at an example:
Suppose you have a table named "accounts" with two columns: "account_id" and "balance."

```sql
CREATE TABLE accounts (
    account_id INT PRIMARY KEY,
    balance DECIMAL(10, 2)
);
INSERT INTO accounts (account_id, balance) VALUES (1, 1000.00);
```

Now, let's consider two transactions:

**Transaction 1:**

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 200 WHERE account_id = 1;
```

**Transaction 2:**

```sql
START TRANSACTION;
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT balance FROM accounts WHERE account_id = 1;
```

In this scenario, Transaction 1 deducts 200 from the account balance. Transaction 2 is set to "READ UNCOMMITTED" isolation level, which allows it to read
uncommitted changes from other transactions.

If Transaction 2 is executed before Transaction 1 is committed, it might read the modified (dirty) balance value of 800, even though Transaction 1 hasn't
completed yet. If Transaction 1 is later rolled back for some reason, the balance will remain unaffected. This leads to a situation where Transaction 2
has read incorrect data.

To prevent dirty reads, you would generally use a higher isolation level like "REPEATABLE READ" or "SERIALIZABLE," which ensure that a transaction only
sees committed changes from other transactions.

Remember that dirty reads can lead to inconsistent data and incorrect results in your application. It's essential to choose the appropriate isolation
level based on your application's requirements and carefully manage transactions to maintain data integrity.

## NON REPEATABLE READS

The "non-repeatable read" is a phenomenon that occurs in database systems when a transaction reads the same data twice within the same transaction, but the data changes between the two reads due to another committed transaction. This can lead to unexpected and inconsistent results.

Let's understand this with an example:

Suppose we have a table named "products" with two columns: "product_id" and "price."

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    price DECIMAL(10, 2)
);

INSERT INTO products (product_id, price) VALUES (1, 100.00);
```

Now, consider two transactions:

**Transaction 1:**

```sql
-- Read the price of product with ID 1
START TRANSACTION;
SELECT price FROM products WHERE product_id = 1;
-- ... some other operations
```

**Transaction 2:**

```sql
-- Update the price of product with ID 1
START TRANSACTION;
UPDATE products SET price = 120.00 WHERE product_id = 1;
COMMIT;
```

In this scenario, let's see what happens:

1. Transaction 1 begins and reads the price of product with ID 1, which is $100.00.
2. Transaction 2 begins and updates the price of the same product to $120.00 and commits the change.
3. Back to Transaction 1, if it reads the price again, it might now see the updated price of $120.00 due to the committed change made by Transaction 2.

As a result, within the same transaction, Transaction 1 has observed a change in the data it read. This non-repeatable read can lead to confusion and incorrect calculations if the application relies on consistent data within a single transaction.

## PHANTOM READ

A "phantom read" is a phenomenon that occurs in database systems when a transaction reads a set of rows that satisfy a certain condition, but another concurrent transaction inserts or deletes rows that match the condition before the first transaction completes. This can lead to unexpected results,
where the set of rows that the first transaction reads changes between multiple reads within the same transaction.

Let's illustrate this with an example using the same "products" table as before:

```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY,
    price DECIMAL(10, 2)
);

INSERT INTO products (product_id, price) VALUES (1, 100.00);
INSERT INTO products (product_id, price) VALUES (2, 150.00);
```

Now, consider two transactions:

**Transaction 1:**

```sql
-- Read the count of products with price > 100
START TRANSACTION;
SELECT COUNT(*) FROM products WHERE price > 100;
-- ... some other operations
```

**Transaction 2:**

```sql
-- Insert a new product with price > 100
START TRANSACTION;
INSERT INTO products (product_id, price) VALUES (3, 120.00);
COMMIT;
```

In this scenario, let's see what happens:

1. Transaction 1 begins and reads the count of products with a price greater than $100. It sees that there are 2 such products.
2. Meanwhile, Transaction 2 begins and inserts a new product with a price greater than $100.
3. Back to Transaction 1, if it reads the count of products again, it might now see that there are 3 products with a price greater than $100 due to the
   insertion made by Transaction 2.

As a result, within the same transaction, Transaction 1 has observed a change in the set of rows it read. This phantom read can lead to inconsistent
results and calculations if the application relies on a consistent set of rows within a single transaction.

To mitigate phantom reads, database systems provide higher isolation levels like "SERIALIZABLE," which ensure that transactions can't see changes made by other transactions that were committed after the start of the current transaction. This prevents anomalies like phantom reads but can also impact concurrency.

To mitigate non-repeatable reads, database systems provide different isolation levels. For example:

- **REPEATABLE READ**: Ensures that within a transaction, the same data is read consistently, even if other transactions modify the data. This prevents non-repeatable reads.
- **SERIALIZABLE**: Provides the highest isolation level, preventing not only non-repeatable reads but also other anomalies like phantom reads.

Choosing the appropriate isolation level depends on the requirements of your application and the trade-offs between data consistency and concurrency.

## InnoDB

Storage engine for MySQL
