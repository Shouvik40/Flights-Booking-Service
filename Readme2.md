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

# Transaction 1:

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 200 WHERE account_id = 1;
```

# Transaction 2:

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
