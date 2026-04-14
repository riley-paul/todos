//
//  ListDetailView.swift
//  todos
//
//  Created by Riley James Paul on 2026-04-13.
//

import SwiftUI

struct ListDetailView: View {
    let list: ListModel

    var body: some View {
        TodosView(listId: list.id)
            .navigationTitle(list.name)
    }
}

#Preview {
    ListDetailView(list: ListModel(id: "1", name: "Hello", todoCount: 4))

}
