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
        Text( /*@START_MENU_TOKEN@*/"Hello, World!" /*@END_MENU_TOKEN@*/)
    }
}

#Preview {
    ListDetailView(list: ListModel(id: "1", name: "Hello", todoCount: 4))

}
