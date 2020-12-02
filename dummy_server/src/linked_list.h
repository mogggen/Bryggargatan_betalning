#ifndef LINKED_LIST_H
#define LINKED_LIST_H

/*My own implementation of a single linked list in C.*/

/**Internal structure for storing an element.*/
struct __Element
{
    struct __Element* next;
    char data[0];
};

/**Structure for a single linked list.
 * element_size must be set to the size of the type
 * of element that is to be stored in the list.
 * head must be initialized to NULL.
 * */
struct LinkedList
{
    int element_size;
    struct __Element* head;
};

/**Iterator for iterating over a linked list.*/
struct LinkedListIterator
{
    struct LinkedList* list;
    struct __Element *current;
    struct __Element *prev;
};

/**Adds a new element to the list.
 * New elements are added in the front of the list.
 * @param list list to add to.
 * returns pointer to the new uninitilized element.
 * */
void* add_element(struct LinkedList* list);

/**Frees all elements in the list.
 * @param list list to free all elements from.*/
void free_all_elements(struct LinkedList* list);

/**Creates an iterator from list.
 * @param list list to create iterator from.
 * returns a linked list iterator.*/
struct LinkedListIterator create_iterator(struct LinkedList* list);

/**Steps the iterator forward one step.
 * @param iter the iterator to step.
 * returns 0 if the itertor reached the end of the list.
 * */
char next_iter(struct LinkedListIterator* iter);

/**Get the element from the current iterator position.
 * @param iter the iterator to get value from.*/
void* get_iter_value(struct LinkedListIterator* iter);

/**Removes the element at the current iterator position.
 * @param iter the iterator.
 * Afterwards the iterator will be set to the previous element.
 * Will modify the original list.*/
void remove_iter(struct LinkedListIterator* iter);


#endif
