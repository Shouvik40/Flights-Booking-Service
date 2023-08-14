CASES TO CONSIDER 

1.Seat Availability and Overbooking:
Ensure that the system accurately tracks seat availability in real-time. Implement a mechanism to prevent overbooking, as airlines need to manage the risk of passengers not showing up for their booked flights.

2.Concurrency and Race Conditions:
Handle concurrent requests and race conditions to avoid issues like double bookings or inconsistent data updates. Use appropriate locking mechanisms and transactions to maintain data integrity.

3.Multiple Classes and Price Variations:
Support different classes (economy, business, first) with different seat availability and price variations. The system should display accurate prices and available classes to users.

4.Cancellation and Refunds:
Implement a cancellation policy and handle refunds appropriately. Consider time-based refund policies to accommodate various scenarios.

5.Seat Selection and Preferences:
Provide users with the ability to select their preferred seats during booking, taking into account seat availability and any seat preferences they might have.

6.Flight Search and Filters:
Design efficient flight search and filtering options to help users find suitable flights based on date, time, destination, and other criteria.

7.Payment Gateway Integration:
Securely integrate a payment gateway to process transactions and handle payment failures and retries.

8.User Authentication and Authorization:
Implement a robust user authentication and authorization system to ensure data privacy and restrict certain actions based on user roles.

9.Booking Confirmation and Notifications:
Send booking confirmations and notifications to users via email or SMS. Handle reservation expiry and ticketing deadlines.

10.Internationalization and Localization:
Support multiple languages and currencies to cater to users from different regions.

11.Error Handling and Logging:
Implement proper error handling and logging mechanisms to identify issues and monitor system performance.

12.Data Security and Compliance:
Ensure that sensitive user and payment information are securely stored and comply with relevant data protection regulations.

13.Load Balancing and Scalability:
Design the system with scalability in mind to handle increasing traffic and load balancing across multiple servers.

14.Integration with Airlines and GDS:
If necessary, integrate with airlines' Global Distribution Systems (GDS) to fetch real-time flight data and make bookings.

15.Testing and Quality Assurance:
Conduct thorough testing, including functional, performance, and security testing, to ensure the system works as expected.

16.Privacy Concerns:
Address privacy concerns regarding user data and ensure compliance with relevant privacy laws.

17.Accessibility:
Design the user interface to be accessible for users with disabilities, following accessibility guidelines.


Database Transaction?

What is db transaction?
1.In real life situations we might need to execure a series of queries in order to accomplish a task.
2. we might do a club of CRUD operations. These series of operstions can execute a single unit of work based on our product and hence 
these series of operations are called db transaction


Now during the transaction execution our db might go through a lot of changes and can be in an inconsistent intermediate state.

So for these problems databases may support 4 transactional capabilities -
    A -Atomicity 
    C -Consistancy
    I -Isolation
    D -Durability   


A- ATOMICITY - A transaction is a bundle of statements that intends to achieve one final state. When we are attempting a
transaction we either want to complete all the statements or none of them.We never want an intermediate state. This is called
as Atomicity

STATE - Begin --> when transaction just starts
        Commit --> when all the changes are applied successfully.
        Rollback--> something happened in between and then whatever changes were successfull will be reverted


                        Begin 
                        /   \
                    Commit  Rollback 

C -Consistancy - Data stored in a db is always valid and in a consistant state.

I -Isolation - It is an ability of multiple transactions to execute without interfaring with one another.
D -Durability -  If something changed in the database and any unforseen circimstances happened then our changes should persist.


How databases ensure atomicity?
preferred-->1. Logging - DBMS logs all actions that it is doing so that later it can undo it(can be maintained in memory(RAM) or disc)
        2. Shadow Paging -  DBMS makes copies of actions(pages and transacitons) and then this copy is initially considered as a temp copy. If transaciton
                    succeds then it starts pointing to the new temp copy.


    Transaction -->     Begin 
                        /   \
                    Commit  Rollback 

atomicity in MySQL --> After each commit and rollback database remains in a consistant state. 
                In order to handle rollbacks    
                        /   \
                 Undo Log  Redo Log 

Undo Log -> This log contains records about how to undo the last change done by a transaction.If any other transaciton need the original data as a 
    partial consistant read operation the unmodified data is retrieved from undo logs.

Redo Log -> By definition, the redo log is a disc based data structure used for crash recovery to correct data written by incomplete transacitons.
    The changes which could make it upto the data files before the crash or any other reasons are replayed automatically during restart of server 
    after crash. 


1. Redo Log:
   When a transaction makes changes to the database, these changes are first 
   written to the transaction log (redo log) before being applied to the actual data pages. This log ensures that if a system crash occurs before 
   the changes are written to the data pages, the changes can be replayed from the redo log during database recovery.

   Redo logs are essential for maintaining data consistency and durability. They ensure that committed changes are not lost in the event of a 
   crash or other failures. Redo logs help the database to "redo" the changes made by transactions during recovery, bringing the database back to 
   a consistent state.

2. Undo Log:
   The undo logs are also a part of the database's transactional mechanism. When a transaction modifies data, the original values of the affected 
   data are stored in the undo log. This allows for the possibility of rolling back or "undoing" the changes made by a transaction.

   Undo logs are used for implementing features such as transaction rollback and MVCC (Multi-Version Concurrency Control). In case a transaction 
   needs to be rolled back, the database can use the undo log to restore the data to its previous state.

In practice, both redo and undo logs are managed by the database management system (DBMS) like MySQL. You don't directly interact with these logs; 
rather, they are used internally to ensure data consistency and support transactional operations.

If you're looking for more specific information about managing transactions, recovery mechanisms, or operational tasks in MySQL, feel free to ask!



Methods Provided By MySQL for Isolation
1.READ UNCOMMITED --> 
            There is almost no isolation for us.
            It reads the latest UNCOMMITED value at every step that can be updated from other uncommited transacitons.
            DIRTY READS - [Link to Readme2.md](./Readme2.md) is possible.

2.READ COMMITED -->
            Here dirty reads is avoided as uncommited chages are not visible to any other transaciton until committed.
            In this level each select statement will have its own snapshot of data which can be problematic if we execute same select select again
            because some other transaction might commit and update and we might see new data in second select.

















interleaning and context switch

Axioms
1. Reflexivity
   -Address
   -state
   -H-no
Address-state(state is a subset of Address)
Address- H-no(H-no is a subset of Address)

2. Augmentation (partial dependency)
if x --> y then xz --> yz for any attribute z then there is partial dependency.
https://miro.com/app/board/uXjVMvjm420=/


3.Transitivity 
if x-->y and y-->z then x-->z
https://miro.com/app/board/uXjVMvjm420=/


DB Keys -
Keys are a set of attributes that helps us to uniquely identify a record in 
different situations.
1.Super 2.Composite 3.Candidate 4.Primary 5.Foreign 6.Alternate 
1.Super -  A set of attributes within a table that can uniquely identify a record.




Q1  Optimise this table using normalisation?
Customer Name	item	    shiipping address	    News Letter	    Supplier	Total Order Price
A	            XBOX	    35 Rohini, delhi	    XBOX	        Microsoft	250
B	            PS5	        24 Hoodi, benglaluru	PS5	            Sony	    300
C	            XBOX,PS5	12 Amora, pune	        XBOX,PS5	    Wholesale	450
D	            PS5	        34, varanasi, up	    PS5	            Sony	    300S


Sol -  https://miro.com/app/board/uXjVMvjm420=/


Q2. Design a db for ta quora like app  
-   User should be able to post a question
-   User should be able to answer a question
-   User should be able to comment on an answer 
-   User should be able to comment on an comment 
-   User should be able to like a comment or a question or an answer
-   User should be able to follow another user
-   Every question can belong to multiple topics
-   Every can follow a topic also
-   You should be able to filter out a question based on a topic

Sol -  https://miro.com/app/board/uXjVMvjm420=/
